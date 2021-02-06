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

import Like from './Like';
import Post from './Post';

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

  @OneToMany(() => Post, (post) => post.user, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'author_id' })
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'user_id' })
  like: Like[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
