import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Post from '../entities/Post';
import { PostResolver } from '../resolvers/post.resolver';
import { PostService } from '../services/post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService, PostResolver],
})
export class PostModule {}
