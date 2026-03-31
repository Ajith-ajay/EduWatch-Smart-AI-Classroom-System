import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    });
  }

  validate(payload: any) {
    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return {
      userId: payload.sub,
    };
  }
}
