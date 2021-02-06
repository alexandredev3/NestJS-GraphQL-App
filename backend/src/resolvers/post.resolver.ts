import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { EnsureAuthenticationhGuard } from '../auth/jwt.guard';
import { CurrentUser, IPayload } from '../decorators/CurrentUser';
import Post from '../entities/Post';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { LikeService } from '../services/like.service';
import { PostService } from '../services/post.service';
import CreateLikeType from '../types/createLike.type';
import DeleteLikeType from '../types/deleteLike.type';

@UseFilters(new HttpExceptionFilter())
@Resolver(Post)
export class PostResolver {
  constructor(
    @Inject(PostService) private postService: PostService,
    @Inject(LikeService) private likeService: LikeService
  ) {}

  @UseGuards(EnsureAuthenticationhGuard)
  @Query(() => [Post])
  async getPosts(): Promise<Post[]> {
    const posts = await this.postService.getPosts();

    return posts;
  }

  @UseGuards(EnsureAuthenticationhGuard)
  @Mutation(() => Post)
  async createPost(
    @CurrentUser() payload: IPayload,
    @Args('title') title: string,
    @Args('description') description: string
  ): Promise<Post> {
    const post = await this.postService.createPost({
      author_id: payload.user.id,
      title,
      description,
    });

    return post;
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

    await this.likeService.deleteLike({
      user_id: id,
      post_id,
    });

    return {
      message: 'Like successfully deleted',
    };
  }
}
