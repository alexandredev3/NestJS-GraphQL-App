import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { AuthModule } from './auth.module';
import { CommentLikeModule } from './comment-like.module';
import { CommentModule } from './comment.module';
import { OrmModule } from './orm.module';
import { PostLikeModule } from './post-like.module';
import { PostModule } from './post.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.sql',
      playground: true,
    }),
    OrmModule,
    UserModule,
    AuthModule,
    PostModule,
    PostLikeModule,
    CommentModule,
    CommentLikeModule,
  ],
})
export class AppModule {}
