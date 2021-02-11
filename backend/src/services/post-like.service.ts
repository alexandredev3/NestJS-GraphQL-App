import { Repository } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import ICreatePostLikeDTO from '../dtos/ICreatePostLikeDTO';
import IDeletePostLikeDTO from '../dtos/IDeletePostLikeDTO';
import Post from '../entities/Post';
import PostLike from '../entities/PostLike';

@Injectable()
export class PostLikeService {
  constructor(
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
    @InjectRepository(Post) private postRepository: Repository<Post>
  ) {}

  public async getPostLikes(post_id: string): Promise<PostLike[] | null> {
    const likes = await this.postLikeRepository.find({
      where: {
        post_id,
      },
      relations: ['user'],
    });

    return likes;
  }

  public async createPostLike(data: ICreatePostLikeDTO): Promise<PostLike> {
    const { user_id, post_id } = data;

    const post = await this.postRepository.findOne({
      id: post_id,
    });

    if (!post) {
      throw new HttpException('Post does not exists', HttpStatus.BAD_REQUEST);
    }

    const postLike = await this.postLikeRepository.findOne({
      where: {
        user_id,
        post_id,
      },
    });

    if (postLike) {
      throw new HttpException('Post already liked.', HttpStatus.BAD_REQUEST);
    }

    const like = this.postLikeRepository.create(data);

    await this.postLikeRepository.save(like);

    return like;
  }

  public async deletePostLike(data: IDeletePostLikeDTO): Promise<void> {
    const { user_id, post_like_id } = data;

    const postLike = await this.postLikeRepository.findOne({
      where: {
        id: post_like_id,
      },
    });

    if (!postLike) {
      throw new HttpException(
        'current user did not like this post',
        HttpStatus.BAD_REQUEST
      );
    }

    if (user_id !== postLike.user_id) {
      throw new HttpException(
        'You are not allowed to delete this like',
        HttpStatus.UNAUTHORIZED
      );
    }

    const { id } = postLike;

    await this.postLikeRepository.delete(id);
  }
}
