import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

import createRandomPost from './helpers/createRandomPost';
import appModuleTest from './modules/appModuleTest';

describe('Post Resolver', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const appModule = await appModuleTest();

    app = appModule.createNestApplication();
    await app.init();
  });

  describe('root', () => {
    it('should create a new post', async () => {
      const { post } = await createRandomPost(app);

      expect(post).toHaveProperty('id');
    });

    it('should returns all posts', async () => {
      const iterable = Array.from({ length: 3 }, (_, index) => index);
      const { authenticationToken } = await createRandomPost(app);

      await Promise.all(
        iterable.map(async (_) => {
          await createRandomPost(app);
        })
      );

      const postResult = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authenticationToken}`)
        .send({
          query: `query {
            getPosts {
              id
              title
              description
              likes_count
              user {
                id
                name
              }
            }
          }`,
        });

      const { status } = postResult;

      expect(status).toBe(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
