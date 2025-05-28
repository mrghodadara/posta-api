import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UserProvider, UserStatus } from 'src/users/interface/user.enum';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { avatar, firstName, lastName, email, password } = signUpDto;

    const alreadyUser = await this.usersService.getUserByEmail(email);

    if (alreadyUser) {
      throw new BadRequestException('A user with this email already exists.');
    }

    const hasePassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.createUser({
      avatar,
      firstName,
      lastName,
      email,
      password: hasePassword,
      provider: UserProvider.EMAIL,
    });

    const accessToken = this.jwtService.sign({ _id: user?._id });

    return {
      accessToken,
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user?.password);

    if (!isValidPassword) {
      throw new NotFoundException('Invalid email or password');
    }

    if (user?.status === UserStatus.DELETED) {
      throw new UnauthorizedException(
        'Your account is not active. Please contact support',
      );
    }

    const accessToken = this.jwtService.sign({ _id: user?._id });

    return {
      accessToken,
      user,
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user?.password,
    );

    if (!isValidPassword) {
      throw new NotFoundException('Current password is incorrect');
    }

    const hasePassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.updateUser(userId, { password: hasePassword });

    return {
      data: {
        message: 'Password changed successfully',
      },
    };
  }

  async deleteAccount(userId: string) {
    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersService.updateUser(userId, { status: UserStatus.DELETED });

    return {
      data: {
        message: 'Your account has been successfully deleted',
      },
    };
  }
}
