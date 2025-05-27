/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service'; // Or UsersService if you want to fetch user details

export interface JwtPayload {
  email: string;
  sub: number; // userId
  role: string; // userRole
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService, // Or UsersService
  ) {
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'fallbackSecret123!',
      ),
    });
  }

  validate(payload: JwtPayload): any {
    // You might want to fetch the user from DB to ensure they still exist/are active
    // const user = await this.usersService.findOne(payload.sub);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user; // Or return a subset of user info like { userId: payload.sub, email: payload.email, role: payload.role }
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
