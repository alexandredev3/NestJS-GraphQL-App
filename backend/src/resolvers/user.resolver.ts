import { classToClass } from 'class-transformer';

import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { EnsureAuthenticationhGuard } from '../auth/jwt.guard';
import User from '../entities/User';
import { UserService } from '../services/user.service';

@Resolver(User)
export class UserResolver {
  constructor(@Inject(UserService) private userService: UserService) {}

  @UseGuards(EnsureAuthenticationhGuard)
  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    const users = await this.userService.getUsers();

    return classToClass(users);
  }

  @UseGuards(EnsureAuthenticationhGuard)
  @Query(() => User)
  async getUnique(@Args('user_id') user_id: string): Promise<User> {
    const users = await this.userService.getUniqueUser(user_id);

    return classToClass(users);
  }

  @Mutation(() => User)
  async createUser(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<User> {
    const user = this.userService.createUser({
      name,
      email,
      password,
    });

    return user;
  }
}
