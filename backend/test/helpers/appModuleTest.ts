import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthModule } from '../../src/modules/auth.module';
import { OrmModule } from '../../src/modules/orm.module';
import { PostLikeModule } from '../../src/modules/post-like.module';
import { PostModule } from '../../src/modules/post.module';
import { UserModule } from '../../src/modules/user.module';

export default async function appModuleTest(): Promise<TestingModule> {
  const moduleTest: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        envFilePath: '.test.env',
      }),
      GraphQLModule.forRoot({
        autoSchemaFile: 'schema.sql',
      }),
      OrmModule,
      UserModule,
      AuthModule,
      PostModule,
      PostLikeModule,
    ],
  }).compile();

  return moduleTest;
}
