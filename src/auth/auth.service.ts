import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UserProvider } from 'src/users/interface/user.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    // private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { avatar, firstName, lastName, email, password } = signUpDto;

    const alreadyUser = await this.usersService.getUserByEmail(email);

    if (alreadyUser) {
      throw new BadRequestException('Email already in use');
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

    // const accessToken = this.jwtService.sign({ _id: user?._id });

    return {
      user,
      //   accessToken,
    };
  }
}
