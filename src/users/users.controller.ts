import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './decorator/user.decorator';

@Controller('/users')
export class UsersController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getUser(@User() user) {
    return user;
  }
}
