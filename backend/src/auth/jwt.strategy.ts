import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

interface IDecodedPayload {
  user: {
    id: string;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.PUBLIC_KEY,
    });
  }

  async validate(payload: IDecodedPayload): Promise<IDecodedPayload> {
    return payload;
  }
}
