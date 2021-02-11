import { Repository } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import ICreateCommentLikeDTO from '../dtos/ICreateCommentLikeDTO';
import IDeleteCommentLikeDTO from '../dtos/IDeleteCommentLikeDTO';
import Comment from '../entities/Comment';
import CommentLike from '../entities/CommentLike';

@Injectable()
export class CommentLikeService {
  constructor(
    @InjectRepository(CommentLike)
    private commentLikeRepository: Repository<CommentLike>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>
  ) {}

  public async getCommentLikes(
    comment_id: string
  ): Promise<CommentLike[] | null> {
    const likes = await this.commentLikeRepository.find({
      where: {
        comment_id,
      },
      relations: ['user'],
    });

    return likes;
  }

  public async createCommentLike(
    data: ICreateCommentLikeDTO
  ): Promise<CommentLike> {
    const { user_id, comment_id } = data;

    const comment = await this.commentRepository.findOne({
      id: comment_id,
    });

    if (!comment) {
      throw new HttpException(
        'Comment does not exists',
        HttpStatus.BAD_REQUEST
      );
    }

    const commentLike = await this.commentLikeRepository.findOne({
      where: {
        comment_id,
        user_id,
      },
    });

    if (commentLike) {
      throw new HttpException('Comment already liked.', HttpStatus.BAD_REQUEST);
    }

    const like = this.commentLikeRepository.create(data);

    await this.commentLikeRepository.save(like);

    return like;
  }

  public async deleteCommentLike(data: IDeleteCommentLikeDTO): Promise<void> {
    const { user_id, comment_like_id } = data;

    const commentLike = await this.commentLikeRepository.findOne({
      where: {
        id: comment_like_id,
      },
    });

    if (!commentLike) {
      throw new HttpException(
        'current user did not like this comment',
        HttpStatus.BAD_REQUEST
      );
    }

    if (user_id !== commentLike.user_id) {
      throw new HttpException(
        'You are not allowed to delete this like',
        HttpStatus.UNAUTHORIZED
      );
    }

    const { id } = commentLike;

    await this.commentLikeRepository.delete(id);
  }
}
