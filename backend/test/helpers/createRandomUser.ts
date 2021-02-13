import * as faker from 'faker';
import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

interface IResponse {
  authenticationToken: string;
}

export default async function createRandomUser(
  app: INestApplication
): Promise<IResponse> {
  const randomName = faker.name.findName();
  const randomEmail = faker.internet.email();
  const randomPassword = faker.internet.password(12);

  await request(app.getHttpServer())
    .post('/graphql')
    .type('form')
    .set('Accept', 'aplication/json')
    .send({
      query: `mutation {
        createUser(name: "${randomName}", email: "${randomEmail}", password: "${randomPassword}") {
          id
          name
        }
      }`,
    });

  const sessionResult = await request(app.getHttpServer())
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

  const { token } = JSON.parse(sessionResult.text).data.session;

  return {
    authenticationToken: token,
  };
}
