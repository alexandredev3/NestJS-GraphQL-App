import { classToClass } from 'class-transformer';

import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';

import { EnsureAuthenticationhGuard } from '../auth/jwt.guard';
import { CurrentUser, IPayload } from '../decorators/CurrentUser';
import Like from '../entities/Like';
import { LikeService } from '../services/like.service';
import CreateLikeType from '../types/createLike.type';
import DeleteLikeType from '../types/deleteLike.type';

@Resolver(Like)
export class LikeResolver {
  constructor(@Inject(LikeService) private likeService: LikeService) {}

  @UseGuards(EnsureAuthenticationhGuard)
  @Query(() => [Like])
  async getUsersLiked(
    @Args('post_id') post_id: string
  ): Promise<Like[] | null> {
    const likes = await this.likeService.getUsersLiked(post_id);

    return classToClass(likes);
  }

  @UseGuards(EnsureAuthenticationhGuard)
  @Mutation(() => CreateLikeType)
  async createLike(
    @CurrentUser() payload: IPayload,
    @Args('post_id') post_id: string
  ): Promise<CreateLikeType> {
    const { id } = payload.user;

    await this.likeService.createLike({
      user_id: id,
      post_id,
    });

    return {
      message: 'Like created',
    };
  }

  @UseGuards(EnsureAuthenticationhGuard)
  @Mutation(() => DeleteLikeType)
  async deleteLike(
    @CurrentUser() payload: IPayload,
    @Args('post_id') post_id: string
  ): Promise<DeleteLikeType> {
    const { id } = payload.user;

    console.log(payload);

    await this.likeService.deleteLike({
      user_id: id,
      post_id,
    });

    return {
      message: 'Like successfully deleted',
    };
  }
}
