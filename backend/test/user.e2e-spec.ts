import * as faker from 'faker';
import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import User from '../src/entities/User';
import { OrmModule } from '../src/modules/orm.module';
import { UserModule } from '../src/modules/user.module';

describe('UserResolver', () => {
  let app: INestApplication;

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
    await app.init();
  });

  describe('root', () => {
    it('should create a new user', async () => {
      const name = faker.name.findName();
      const email = faker.internet.email();
      const password = faker.internet.password(12);

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .send({
          query: `mutation {
            createUser(name: "${name}", email: "${email}", password: "${password}") {
              id
              name
            }
          }`,
        });

      const data = JSON.parse(result.text).data.createUser;
      const dataToCompare = {
        id: `${data.id}`,
        name: `${name}`,
      };

      expect(data).toEqual(dataToCompare);
    });
    it('should not create a user duplicate', async () => {
      const name = faker.name.findName();
      const email = faker.internet.email();
      const password = faker.internet.password(12);

      await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .send({
          query: `mutation {
          createUser(name: "${name}", email: "${email}", password: "${password}") {
            id
            name
          }
        }`,
        });

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .send({
          query: `mutation {
            createUser(name: "${name}", email: "${email}", password: "${password}") {
              id
              name
            }
          }`,
        });

      const errors = JSON.parse(result.text).errors as Array<{
        message: string;
      }>;

      const error = errors.find(
        (err) => err.message === 'User already exists.'
      );

      expect(error.message).toBe('User already exists.');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
