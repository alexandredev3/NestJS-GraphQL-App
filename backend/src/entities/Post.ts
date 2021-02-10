import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';

import { ObjectType, Field } from '@nestjs/graphql';

import Comment from './Comment';
import Like from './Like';
import User from './User';

@Entity('posts')
@ObjectType()
export default class Post {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('varchar')
  title: string;

  @Field()
  @Column('varchar')
  description: string;

  @Field()
  @Column('decimal', { default: 0 })
  likes_count: number;

  @Field()
  @Column('decimal', { default: 0 })
  comments_count: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'author_id' })
  user: User;

  @Field(() => [Like])
  @OneToMany(() => Like, (like) => like.posts, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'post_id' })
  @JoinTable()
  likes: Like[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.posts, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'post_id' })
  @JoinTable()
  comments: Comment[];

  @Field()
  @Column('uuid')
  author_id: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
