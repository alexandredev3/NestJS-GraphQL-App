import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { OrmModule } from './orm.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    OrmModule,
    UserModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.sql',
      playground: true,
    }),
  ],
})
export class AppModule {}
