import { ApolloError } from 'apollo-server-express';
import { classToClass } from 'class-transformer';

import { Inject } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import User from '../entities/User';
import { HashService } from '../services/hash.service';
import { UserService } from '../services/user.service';

@Resolver(User)
export class UserResolver {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(HashService) private hashService: HashService
  ) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await this.userService.findMany();

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
      throw new ApolloError('User already exists.', 'CONFLICT');
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
