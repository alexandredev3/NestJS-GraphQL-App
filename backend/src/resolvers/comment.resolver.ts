import { Inject, UseGuards } from '@nestjs/common';
import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';

import { EnsureAuthenticationhGuard } from '../auth/jwt.guard';
import { CurrentUser, IPayload } from '../decorators/CurrentUser';
import Comment from '../entities/Comment';
import { CommentService } from '../services/comment.service';

@Resolver(Comment)
export class CommentResolver {
  constructor(@Inject(CommentService) private commentService: CommentService) {}

  @Query(() => [Comment])
  @UseGuards(EnsureAuthenticationhGuard)
  async getComments(@Args('post_id') post_id: string): Promise<Comment[]> {
    const comments = await this.commentService.getComments(post_id);

    return comments;
  }

  @Mutation(() => Comment)
  @UseGuards(EnsureAuthenticationhGuard)
  async createComment(
    @CurrentUser() payload: IPayload,
    @Args('post_id') post_id: string,
    @Args('content') content: string
  ): Promise<Comment> {
    const { id } = payload.user;

    const comment = await this.commentService.createComment({
      user_id: id,
      post_id,
      content,
    });

    return comment;
  }
}
