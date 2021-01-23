import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';

import { EnsureAuthenticationhGuard } from '../auth/jwt.guard';
import { AuthModule } from './auth.module';
import { OrmModule } from './orm.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.test.env',
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.sql',
      playground: true,
    }),
    OrmModule,
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: EnsureAuthenticationhGuard,
    },
  ],
})
export class AppModule {}
