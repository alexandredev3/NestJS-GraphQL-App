import { classToClass } from 'class-transformer';
import { Repository } from 'typeorm';

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import ICreatePostDTO from '../dtos/ICreatePostDTO';
import Post from '../entities/Post';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>
  ) {}

  public async createPost(data: ICreatePostDTO): Promise<Post> {
    const { author_id, title, description } = data;

    const post = this.postRepository.create({
      author_id,
      title,
      description,
    });

    try {
      await this.postRepository.save(post);

      return post;
    } catch (error) {
      console.log(error);

      throw new HttpException('UNEXPECTED ERROR', HttpStatus.BAD_REQUEST);
    }
  }

  public async getPosts(): Promise<Post[]> {
    const posts = await this.postRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.user', 'user')
      .loadRelationCountAndMap('posts.likes_count', 'posts.likes')
      .loadRelationCountAndMap('posts.comments_count', 'posts.comments')
      .getMany();

    return classToClass(posts);
  }
}
