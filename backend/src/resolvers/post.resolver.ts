import { classToClass } from 'class-transformer';

import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { EnsureAuthenticationhGuard } from '../auth/jwt.guard';
import { CurrentUser, IPayload } from '../decorators/CurrentUser';
import Post from '../entities/Post';
import { PostService } from '../services/post.service';

@Resolver(Post)
export class PostResolver {
  constructor(@Inject(PostService) private postService: PostService) {}

  @UseGuards(EnsureAuthenticationhGuard)
  @Query(() => [Post])
  async getPosts(): Promise<Post[]> {
    const posts = await this.postService.getPosts();

    return classToClass(posts);
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

    return classToClass(post);
  }
}
