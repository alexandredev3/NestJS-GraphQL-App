import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Comment from '../entities/Comment';
import CommentLike from '../entities/CommentLike';
import { CommentLikeResolver } from '../resolvers/comment-like.resolver';
import { CommentLikeService } from '../services/comment-like.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommentLike, Comment])],
  providers: [CommentLikeService, CommentLikeResolver],
})
export class CommentLikeModule {}
