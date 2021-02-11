import { classToClass } from 'class-transformer';

import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';

import { EnsureAuthenticationhGuard } from '../auth/jwt.guard';
import { CurrentUser, IPayload } from '../decorators/CurrentUser';
import PostLike from '../entities/PostLike';
import { PostLikeService } from '../services/post-like.service';
import CreateLikeType from '../types/createLike.type';
import DeleteLikeType from '../types/deleteLike.type';

@Resolver(PostLike)
export class PostLikeResolver {
  constructor(
    @Inject(PostLikeService) private postLikeService: PostLikeService
  ) {}

  @UseGuards(EnsureAuthenticationhGuard)
  @Query(() => [PostLike])
  async getPostLikes(
    @Args('post_id') post_id: string
  ): Promise<PostLike[] | null> {
    const likes = await this.postLikeService.getPostLikes(post_id);

    return classToClass(likes);
  }

  @UseGuards(EnsureAuthenticationhGuard)
  @Mutation(() => CreateLikeType)
  async createPostLike(
    @CurrentUser() payload: IPayload,
    @Args('post_id') post_id: string
  ): Promise<CreateLikeType> {
    const { id } = payload.user;

    const like = await this.postLikeService.createPostLike({
      user_id: id,
      post_id,
    });

    return {
      id: like.id,
      message: 'Like created',
    };
  }

  @UseGuards(EnsureAuthenticationhGuard)
  @Mutation(() => DeleteLikeType)
  async deletePostLike(
    @CurrentUser() payload: IPayload,
    @Args('post_id') post_id: string
  ): Promise<DeleteLikeType> {
    const { id } = payload.user;

    await this.postLikeService.deletePostLike({
      user_id: id,
      post_id,
    });

    return {
      message: 'Like successfully deleted',
    };
  }
}
