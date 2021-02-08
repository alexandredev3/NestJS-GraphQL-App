import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Like from '../entities/Like';
import { LikeResolver } from '../resolvers/like.resolver';
import { LikeService } from '../services/like.service';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  providers: [LikeService, LikeResolver],
})
export class LikeModule {}
