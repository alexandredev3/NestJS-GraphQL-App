import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import User from './entities/User';
import { OrmModule } from './modules/orm.module';
import { UserModule } from './modules/user.module';
import { UserResolver } from './resolvers/user.resolver';

describe('UserResolver', () => {
  let userResolver: UserResolver;

  beforeEach(async () => {
    const userTest: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([User]),
        OrmModule,
        UserModule,
        GraphQLModule.forRoot({
          autoSchemaFile: 'schema.sql',
        }),
      ],
    }).compile();

    userResolver = userTest.get<UserResolver>(UserResolver);
  });

  describe('root', () => {
    it('should create a new user', async () => {
      const user = await userResolver.create(
        'Jhon',
        'jhon@gmail.com',
        '12345678'
      );

      expect(user).toHaveProperty('id');
    });
  });
});
