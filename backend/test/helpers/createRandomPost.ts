import * as faker from 'faker';
import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

interface IResponse {
  authenticationToken: string;
  post?: any;
  error?: any;
}

export default async function createRandomPost(
  app: INestApplication
): Promise<IResponse> {
  const randomName = faker.name.findName();
  const randomEmail = faker.internet.email();
  const randomPassword = faker.internet.password(12);
  const randomTitle = faker.name.title();
  const randomDescription = faker.lorem.paragraphs(1);

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

  const postResult = await request(app.getHttpServer())
    .post('/graphql')
    .type('form')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send({
      query: `mutation {
        createPost(title: "${randomTitle}", description: "${randomDescription}") {
          id
        }
      }`,
    });

  const post = JSON.parse(postResult.text);
  const postCreated = post.data.createPost;
  const postError = post.errors;

  if (postCreated)
    return {
      authenticationToken: token,
      post: postCreated,
    };

  return {
    authenticationToken: token,
    error: postError,
  };
}
