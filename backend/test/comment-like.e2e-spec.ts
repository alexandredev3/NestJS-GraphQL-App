import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

import createRandomComment from './helpers/createRandomComment';
import appModuleTest from './modules/appModuleTest';

describe('Comment Like Resolver', () => {
  let app: INestApplication;
  let token: string;
  let commentId: string;

  beforeAll(async () => {
    const appModule = await appModuleTest();

    app = appModule.createNestApplication();
    await app.init();

    const { authenticationToken, comment } = await createRandomComment(app);

    token = authenticationToken;
    commentId = comment.id;
  });

  describe('root', () => {
    it('should create a like', async () => {
      const commentLikeResult = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `mutation {
            createCommentLike(comment_id: "${commentId}") {
              id
              status
            }
          }`,
        });

      const { status } = JSON.parse(
        commentLikeResult.text
      ).data.createCommentLike;

      expect(status).toBe('Like created');
    });

    it('should not the user liked a post that this user already liked', async () => {
      const commentLikeResult = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `mutation {
            createCommentLike(comment_id: "${commentId}") {
              id
              status
            }
          }`,
        });

      const errors = JSON.parse(commentLikeResult.text)?.errors as Array<{
        message: string;
      }>;

      const error = errors.find(
        (err) => err.message === 'Comment already liked.'
      );

      expect(error.message).toBe('Comment already liked.');
    });

    it('should delete a like', async () => {
      const { comment } = await createRandomComment(app);

      const commentLikeResult = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `mutation {
            createCommentLike(comment_id: "${comment.id}") {
              id
              status
            }
          }`,
        });

      const likeCreated = JSON.parse(commentLikeResult.text).data
        .createCommentLike;

      const commentDeleteLikeResult = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `mutation {
            deleteCommentLike(comment_like_id: "${likeCreated.id}") {
              status
            }
          }`,
        });

      const like = JSON.parse(commentDeleteLikeResult.text).data
        .deleteCommentLike;

      expect(like.status).toBe('Like successfully deleted');
    });

    it('should not the user delete the like of another user', async () => {
      const { authenticationToken } = await createRandomComment(app);

      const commentLikeResult = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authenticationToken}`)
        .send({
          query: `mutation {
            createCommentLike(comment_id: "${commentId}") {
              id
              status
            }
          }`,
        });

      const likeCreated = JSON.parse(commentLikeResult.text).data
        .createCommentLike;

      const commentDeleteLikeResult = await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `mutation {
            deleteCommentLike(comment_like_id: "${likeCreated.id}") {
              status
            }
          }`,
        });

      const errors = JSON.parse(commentDeleteLikeResult.text)?.errors as Array<{
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
