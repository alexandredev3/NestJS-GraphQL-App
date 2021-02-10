import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Comment from '../entities/Comment';
import { CommentResolver } from '../resolvers/comment.resolver';
import { CommentService } from '../services/comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [CommentService, CommentResolver],
})
export class CommentModule {}
