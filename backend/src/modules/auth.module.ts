import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from '../auth/jwt.strategy';
import User from '../entities/User';
import { SessionResolver } from '../resolvers/session.resolver';
import { AuthService } from '../services/auth.service';
import { EnvService } from '../services/env.service';
import { HashService } from '../services/hash.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.test.env',
    }),
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.PRIVATE_KEY,
        signOptions: {
          algorithm: 'RS256',
          expiresIn: '3d',
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    EnvService,
    JwtStrategy,
    HashService,
    SessionResolver,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
