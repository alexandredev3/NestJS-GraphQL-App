import * as faker from 'faker';
import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

import appModuleTest from './modules/appModuleTest';

describe('Session Resolver', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const appModule = await appModuleTest();

    app = appModule.createNestApplication();
    await app.init();
  });

  describe('root', () => {
    it('should authenticate a user and return a token', async () => {
      const randomName = faker.name.findName();
      const randomEmail = faker.internet.email();
      const randomPassword = faker.internet.password(12);

      await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .send({
          query: `mutation {
            createUser(name: "${randomName}", email: "${randomEmail}", password: "${randomPassword}") {
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
            session(email: "${randomEmail}", password: "${randomPassword}") {
              user {
                id
                name
              }
              token
            }
          }`,
        });

      const data = JSON.parse(result.text).data.session;

      expect(data).toHaveProperty('token');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
