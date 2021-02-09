import * as faker from 'faker';
import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

import appModuleTest from './helpers/appModuleTest';

describe('Post Resolver', () => {
  let app: INestApplication;
  let authenticationToken: string;

  beforeAll(async () => {
    const randomName = faker.name.findName();
    const randomEmail = faker.internet.email();
    const randomPassword = faker.internet.password(12);
    const appModule = await appModuleTest();

    app = appModule.createNestApplication();
    await app.init();

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

    authenticationToken = token;
  });

  describe('root', () => {
    it('should create a new post', async () => {
      const randomTitle = faker.name.title();
      const randomDescription = faker.lorem.paragraphs(1);

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

      const data = JSON.parse(postResult.text).data.createPost;

      expect(data).toHaveProperty('id');
    });

    it('should returns all posts', async () => {
      const iterable = Array.from({ length: 3 }, (_, index) => index);

      await Promise.all(
        iterable.map(async (_) => {
          const randomTitle = faker.name.title();
          const randomDescription = faker.lorem.paragraphs(1);

          return request(app.getHttpServer())
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
