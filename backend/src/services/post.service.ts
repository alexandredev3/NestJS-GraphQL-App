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
    const post = this.postRepository.create(data);

    try {
      await this.postRepository.save(post);

      return post;
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'INTERNAL_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async getPosts(): Promise<Post[]> {
    const posts = await this.postRepository
      .createQueryBuilder('posts')
      .loadRelationCountAndMap('posts.likes_count', 'posts.likes')
      .getMany();

    return posts;
  }
}
