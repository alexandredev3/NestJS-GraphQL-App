import { Inject } from '@nestjs/common';
import { Mutation, Args, Resolver } from '@nestjs/graphql';

import { AuthService } from '../services/auth.service';
import SessionType from '../types/session.type';

interface IResponse {
  user: {
    id: string;
    name: string;
  };
  token: string;
}

@Resolver(SessionType)
export class SessionResolver {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Mutation(() => SessionType)
  async session(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<IResponse> {
    const user = await this.authService.authetication({
      email,
      password,
    });

    const { id, name, token } = user;

    return {
      user: {
        id,
        name,
      },
      token,
    };
  }
}
