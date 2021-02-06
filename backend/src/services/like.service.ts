import { Repository } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import ICreateLikeDTO from '../dtos/ICreateLikeDTO';
import IDeleteLikeDTO from '../dtos/IDeleteLikeDTO';
import Like from '../entities/Like';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>
  ) {}

  public async createLike(data: ICreateLikeDTO): Promise<void> {
    const { user_id, post_id } = data;

    const postAlreadyLiked = await this.likeRepository.findOne({
      where: {
        user_id,
        post_id,
      },
    });

    if (postAlreadyLiked) {
      throw new HttpException('Post already liked.', HttpStatus.BAD_REQUEST);
    }

    const like = this.likeRepository.create(data);

    await this.likeRepository.save(like);
  }

  public async deleteLike(data: IDeleteLikeDTO): Promise<void> {
    const { user_id, post_id } = data;

    const postWasNotLiked = await this.likeRepository.findOne({
      where: {
        user_id,
        post_id,
      },
    });

    if (!postWasNotLiked) {
      throw new HttpException(
        'current user did not like this post',
        HttpStatus.BAD_REQUEST
      );
    }

    const { id } = postWasNotLiked;

    await this.likeRepository.delete(id);
  }
}
