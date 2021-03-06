import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import ICreateCommentDTO from '../dtos/ICreateCommentDTO';
import Comment from '../entities/Comment';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>
  ) {}

  public async getComments(post_id: string): Promise<Comment[]> {
    const comments = await this.commentRepository
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.user', 'user')
      .loadRelationCountAndMap('comments.likes_count', 'comments.likes')
      .getMany();

    return comments;
  }

  public async createComment(data: ICreateCommentDTO): Promise<Comment> {
    const comment = this.commentRepository.create(data);

    await this.commentRepository.save(comment);

    return comment;
  }
}
