import * as faker from 'faker';
import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import User from '../src/entities/User';
import { OrmModule } from '../src/modules/orm.module';
import { UserModule } from '../src/modules/user.module';
import { HashService } from '../src/services/hash.service';
import { UserService } from '../src/services/user.service';

describe('UserResolver', () => {
  let app: INestApplication;
  let hashService: HashService;
  let userService: UserService;

  beforeAll(async () => {
    const userModuleTest: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([User]),
        OrmModule,
        UserModule,
        GraphQLModule.forRoot({
          autoSchemaFile: 'schema.sql',
        }),
      ],
    }).compile();

    app = userModuleTest.createNestApplication();
    hashService = userModuleTest.get<HashService>(HashService);
    userService = userModuleTest.get<UserService>(UserService);
    await app.init();
  });

  describe('root', () => {
    it('should create a new user', async () => {
      const randomName = faker.name.findName();
      const randomEmail = faker.internet.email();
      const randomPassword = faker.internet.password(12);

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .send({
          query: `mutation {
            create(name: "${randomName}", email: "${randomEmail}", password: "${randomPassword}") {
              id
              name
            }
          }`,
        });

      const data = JSON.parse(result.text).data.create;

      const { password } = await userService.findById(data.id);

      const hashCompare = await hashService.compareHash(
        randomPassword,
        password
      );

      expect(hashCompare).toEqual(true);
    });
    afterAll(async () => {
      await app.close();
    });
  });
});
