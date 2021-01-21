import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import User from '../entities/User';
import { UserResolver } from '../resolvers/user.resolver';
import { HashService } from '../services/hash.service';
import { UserService } from '../services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserResolver, HashService],
})
export class UserModule {}
