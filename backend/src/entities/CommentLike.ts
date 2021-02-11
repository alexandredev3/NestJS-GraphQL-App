import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';

import { Field, ObjectType } from '@nestjs/graphql';

import Comment from './Comment';
import User from './User';

@ObjectType()
@Entity('comments_likes')
export default class CommentLike {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column('uuid')
  comment_id: string;

  @Field()
  @Column('uuid')
  user_id: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.likes, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Comment, (post) => post.likes, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'comment_id' })
  @JoinTable()
  comments: Comment;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
