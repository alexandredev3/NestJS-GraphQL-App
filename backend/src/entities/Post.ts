import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field } from '@nestjs/graphql';

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

  @ManyToOne(() => User, (user) => user.post, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'author_id' })
  user: User;

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
