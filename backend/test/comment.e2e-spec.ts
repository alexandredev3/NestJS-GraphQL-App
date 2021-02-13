import * as faker from 'faker';
import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

import createRandomPost from './helpers/createRandomPost';
import appModuleTest from './modules/appModuleTest';

describe('Comment Resolver', () => {
  let app: INestApplication;
  let token: string;
  let postId: string;

  beforeAll(async () => {
    const appModule = await appModuleTest();

    app = appModule.createNestApplication();
    await app.init();

    const { authenticationToken, post } = await createRandomPost(app);

    token = authenticationToken;
    postId = post.id;
  });

  describe('root', () => {
    it('should create a comment on a post', async () => {
      const randomContent = faker.lorem.paragraphs(1);

      const commentResult = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `mutation {
            createComment(post_id: "${postId}", content: "${randomContent}") {
              id
              post_id
              content
            }
          }`,
        });

      const data = JSON.parse(commentResult.text).data.createComment;

      expect(data).toHaveProperty('id');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
