import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { IUser } from './interface/user';
import { UserStatus } from './interface/user.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(user: IUser) {
    try {
      const response = await this.userModel.create(user);

      return response;
    } catch {
      throw new BadRequestException('Email already exists');
    }
  }

  async getUserById(id: string) {
    try {
      const response = await this.userModel.findById(id);

      return response;
    } catch {
      throw new BadRequestException('Invalid user id');
    }
  }

  async getUserByEmail(email: string) {
    try {
      const response = await this.userModel.findOne({
        email,
      });

      return response;
    } catch {
      throw new BadRequestException('User not found with this email');
    }
  }

  async updateUser(id: string, user: Partial<IUser>) {
    try {
      const response = await this.userModel.findByIdAndUpdate(id, {
        ...user,
      });

      return response;
    } catch {
      throw new BadRequestException('Invalid user id');
    }
  }

  async deleteUser(id: string) {
    try {
      const response = await this.userModel.findByIdAndUpdate(id, {
        status: UserStatus.DELETED,
      });

      return response;
    } catch {
      throw new BadRequestException('Invalid user id');
    }
  }
}
