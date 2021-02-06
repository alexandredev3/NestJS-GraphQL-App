import * as faker from 'faker';
import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

import appModuleTest from './helpers/appModuleTest';

describe('UserResolver', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const appModule = await appModuleTest();

    app = appModule.createNestApplication();
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
