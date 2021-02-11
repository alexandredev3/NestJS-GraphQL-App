import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Post from '../entities/Post';
import PostLike from '../entities/PostLike';
import { PostLikeResolver } from '../resolvers/post-like.resolver';
import { PostLikeService } from '../services/post-like.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostLike, Post])],
  providers: [PostLikeService, PostLikeResolver],
})
export class PostLikeModule {}
