import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Field, ObjectType } from '@nestjs/graphql';

import Comment from './Comment';
import Post from './Post';
import PostLike from './PostLike';

@ObjectType()
@Entity('users')
export default class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('varchar')
  name: string;

  @Column('varchar', { unique: true })
  @Field()
  @Exclude()
  email: string;

  @Column({ type: 'varchar' })
  @Exclude()
  password: string;

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.user, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'author_id' })
  posts: Post[];

  @OneToMany(() => PostLike, (like) => like.user, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'user_id' })
  likes: PostLike[];

  @OneToMany(() => Comment, (comment) => comment.user, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'user_id' })
  comments: Comment[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
