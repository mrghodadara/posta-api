import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './decorator/user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getUser(@User() user) {
    return { user };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  updateUser(@User() user, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(user?.id, updateUserDto);
  }
}
