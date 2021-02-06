import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';

import { Field, ObjectType } from '@nestjs/graphql';

import Post from './Post';
import User from './User';

@ObjectType()
@Entity('likes')
export default class Like {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column('uuid')
  post_id: string;

  @Field()
  @Column('uuid')
  user_id: string;

  @OneToMany(() => User, (user) => user.like, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.likes, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'post_id' })
  @JoinTable()
  posts: Post;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
