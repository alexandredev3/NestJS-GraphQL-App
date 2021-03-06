import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

import createRandomPost from './helpers/createRandomPost';
import appModuleTest from './modules/appModuleTest';

describe('Post Like Resolver', () => {
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
    it('should create a like', async () => {
      const postLikeResult = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `mutation {
            createPostLike(post_id: "${postId}") {
              id
              status
            }
          }`,
        });

      const { status } = JSON.parse(postLikeResult.text).data.createPostLike;

      expect(status).toBe('Like created');
    });

    it('should not the user liked a post that this user already liked', async () => {
      const postLikeResult = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `mutation {
            createPostLike(post_id: "${postId}") {
              id
              status
            }
          }`,
        });

      const errors = JSON.parse(postLikeResult.text)?.errors as Array<{
        message: string;
      }>;

      const error = errors.find((err) => err.message === 'Post already liked.');

      expect(error.message).toBe('Post already liked.');
    });

    it('should delete a like', async () => {
      const { authenticationToken, post } = await createRandomPost(app);

      const postLikeResult = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authenticationToken}`)
        .send({
          query: `mutation {
            createPostLike(post_id: "${post.id}") {
              id
              status
            }
          }`,
        });

      const likeCreated = JSON.parse(postLikeResult.text).data.createPostLike;

      const postDeleteLikeResult = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authenticationToken}`)
        .send({
          query: `mutation {
            deletePostLike(post_like_id: "${likeCreated.id}") {
              status
            }
          }`,
        });

      const like = JSON.parse(postDeleteLikeResult.text).data.deletePostLike;

      expect(like.status).toBe('Like successfully deleted');
    });

    it('should not the user delete the like of another user', async () => {
      const { authenticationToken } = await createRandomPost(app);

      const postLikeResult = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authenticationToken}`)
        .send({
          query: `mutation {
            createPostLike(post_id: "${postId}") {
              id
              status
            }
          }`,
        });

      const likeCreated = JSON.parse(postLikeResult.text).data.createPostLike;

      const postDeleteLikeResult = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `mutation {
            deletePostLike(post_like_id: "${likeCreated.id}") {
              status
            }
          }`,
        });

      const errors = JSON.parse(postDeleteLikeResult.text)?.errors as Array<{
        message: string;
      }>;

      const error = errors.find(
        (err) => err.message === 'You are not allowed to delete this like'
      );

      expect(error.message).toBe('You are not allowed to delete this like');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
