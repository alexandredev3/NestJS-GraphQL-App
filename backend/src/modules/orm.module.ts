import { resolve } from 'path';

import { Module, Global, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Comment from '../entities/Comment';
import CommentLike from '../entities/CommentLike';
import Post from '../entities/Post';
import PostLike from '../entities/PostLike';
import User from '../entities/User';
import { EnvService } from '../services/env.service';
import { EnvModule } from './env.module';

const entities = [User, Post, PostLike, Comment, CommentLike];

function OrmConfigModule(): DynamicModule {
  const {
    TYPEORM_DATABASE,
    TYPEORM_HOST,
    TYPEORM_PASSWORD,
    TYPEORM_PORT,
    TYPEORM_NAME,
    TYPEORM_TYPE,
  } = new EnvService().getOrmConfig();

  return TypeOrmModule.forRoot({
    type: TYPEORM_TYPE,
    host: TYPEORM_HOST,
    username: TYPEORM_NAME,
    port: TYPEORM_PORT,
    password: TYPEORM_PASSWORD,
    database: TYPEORM_DATABASE,
    migrations: [resolve(__dirname, '..', 'database', 'migrations', '*.ts')],
    entities,
    cli: {
      migrationsDir: resolve(__dirname, '..', 'database', 'migrations'),
    },
  });
}

@Global()
@Module({
  imports: [EnvModule, OrmConfigModule()],
})
export class OrmModule {}
