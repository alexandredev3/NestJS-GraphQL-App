import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Link from '../entities/Like';
import Post from '../entities/Post';
import { PostResolver } from '../resolvers/post.resolver';
import { LikeService } from '../services/like.service';
import { PostService } from '../services/post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Link])],
  providers: [PostService, PostResolver, LikeService],
})
export class PostModule {}
