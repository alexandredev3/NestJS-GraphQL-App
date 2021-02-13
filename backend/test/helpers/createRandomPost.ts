import * as faker from 'faker';
import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

import createRandomUser from './createRandomUser';

interface IResponse {
  authenticationToken: string;
  post?: {
    id: string;
    title: string;
    description: string;
  };
}

export default async function createRandomPost(
  app: INestApplication
): Promise<IResponse> {
  const randomTitle = faker.name.title();
  const randomDescription = faker.lorem.paragraphs(1);

  const { authenticationToken } = await createRandomUser(app);

  const postResult = await request(app.getHttpServer())
    .post('/graphql')
    .type('form')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${authenticationToken}`)
    .send({
      query: `mutation {
        createPost(title: "${randomTitle}", description: "${randomDescription}") {
          id
        }
      }`,
    });

  const post = JSON.parse(postResult.text);
  const postCreated = post.data.createPost;

  return {
    authenticationToken,
    post: postCreated,
  };
}
