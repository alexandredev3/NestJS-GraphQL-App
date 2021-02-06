import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import User from '../../src/entities/User';
import { AuthModule } from '../../src/modules/auth.module';
import { OrmModule } from '../../src/modules/orm.module';
import { PostModule } from '../../src/modules/post.module';
import { UserModule } from '../../src/modules/user.module';

export default async function appModuleTest(): Promise<TestingModule> {
  const moduleTest: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        envFilePath: '.test.env',
      }),
      TypeOrmModule.forFeature([User]),
      OrmModule,
      UserModule,
      AuthModule,
      PostModule,
      GraphQLModule.forRoot({
        autoSchemaFile: 'schema.sql',
      }),
    ],
  }).compile();

  return moduleTest;
}
