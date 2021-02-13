import * as faker from 'faker';
import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

import createRandomPost from './createRandomPost';

interface IResponse {
  authenticationToken: string;
  comment?: {
    id: string;
    post_id: string;
    content: string;
  };
}

export default async function createRandomComment(
  app: INestApplication
): Promise<IResponse> {
  const randomContent = faker.lorem.paragraphs(1);

  const { authenticationToken, post } = await createRandomPost(app);

  const commentResult = await request(app.getHttpServer())
    .post('/graphql')
    .type('form')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${authenticationToken}`)
    .send({
      query: `mutation {
        createComment(post_id: "${post.id}", content: "${randomContent}") {
          id
          post_id
          content
        }
      }`,
    });

  const comment = JSON.parse(commentResult.text);
  const commentCreated = comment.data.createComment;

  return {
    authenticationToken,
    comment: commentCreated,
  };
}
