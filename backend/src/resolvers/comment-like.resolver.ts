import { classToClass } from 'class-transformer';

import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';

import { EnsureAuthenticationhGuard } from '../auth/jwt.guard';
import { CurrentUser, IPayload } from '../decorators/CurrentUser';
import CommentLike from '../entities/CommentLike';
import { CommentLikeService } from '../services/comment-like.service';
import CreateLikeType from '../types/createLike.type';
import DeleteLikeType from '../types/deleteLike.type';

@Resolver(CommentLike)
export class CommentLikeResolver {
  constructor(
    @Inject(CommentLikeService) private commentLikeService: CommentLikeService
  ) {}

  @UseGuards(EnsureAuthenticationhGuard)
  @Query(() => [CommentLike])
  async getCommentLikes(
    @Args('comment_id') comment_id: string
  ): Promise<CommentLike[] | null> {
    const likes = await this.commentLikeService.getCommentLikes(comment_id);

    return classToClass(likes);
  }

  @UseGuards(EnsureAuthenticationhGuard)
  @Mutation(() => CreateLikeType)
  async createCommentLike(
    @CurrentUser() payload: IPayload,
    @Args('comment_id') comment_id: string
  ): Promise<CreateLikeType> {
    const { id } = payload.user;

    const like = await this.commentLikeService.createCommentLike({
      user_id: id,
      comment_id,
    });

    return {
      id: like.id,
      message: 'Like created',
    };
  }

  @UseGuards(EnsureAuthenticationhGuard)
  @Mutation(() => DeleteLikeType)
  async deleteCommentLike(
    @CurrentUser() payload: IPayload,
    @Args('comment_id') comment_id: string
  ): Promise<DeleteLikeType> {
    const { id } = payload.user;

    await this.commentLikeService.deleteCommentLike({
      user_id: id,
      comment_id,
    });

    return {
      message: 'Like successfully deleted',
    };
  }
}
