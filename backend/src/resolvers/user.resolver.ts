import { classToClass } from 'class-transformer';

import { Inject, HttpException, UseGuards, HttpStatus } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { EnsureAuthenticationhGuard } from '../auth/jwt.guard';
import { CurrentUser, IPayload } from '../decorators/CurrentUser';
import User from '../entities/User';
import { HashService } from '../services/hash.service';
import { UserService } from '../services/user.service';

@Resolver(User)
export class UserResolver {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(HashService) private hashService: HashService
  ) {}

  @UseGuards(EnsureAuthenticationhGuard)
  @Query(() => [User])
  async users(@CurrentUser() payload: IPayload): Promise<User[]> {
    const users = await this.userService.findMany();

    console.log(payload);

    return classToClass(users);
  }

  @Mutation(() => User)
  async create(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<User> {
    const userExists = await this.userService.findByEmail(email);

    if (userExists) {
      throw new HttpException('User already exists.', HttpStatus.NOT_FOUND);
    }

    const passwordHash = await this.hashService.generateHash(password);

    const user = await this.userService.createUser({
      name,
      email,
      password: passwordHash,
    });

    return classToClass(user);
  }
}
