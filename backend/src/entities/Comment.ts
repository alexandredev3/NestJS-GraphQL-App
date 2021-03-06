import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { Field, ObjectType } from '@nestjs/graphql';

import CommentLike from './CommentLike';
import Post from './Post';
import User from './User';

@ObjectType()
@Entity('comments_posts')
export default class Comment {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column('uuid')
  post_id: string;

  @Field()
  @Column('uuid')
  user_id: string;

  @Field()
  likes_count: number;

  @Field()
  @Column('varchar')
  content: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'post_id' })
  @JoinTable()
  posts: Post;

  @Field(() => [CommentLike])
  @OneToMany(() => CommentLike, (like) => like.comments, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'post_id' })
  @JoinTable()
  likes: CommentLike[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
