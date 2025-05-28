import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt?.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { _id: string }) {
    const { _id } = payload;

    const user = await this.usersService.getUserById(_id);
    if (!_id) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}
