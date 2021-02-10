import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { AuthModule } from './auth.module';
import { CommentModule } from './comment.module';
import { LikeModule } from './like.module';
import { OrmModule } from './orm.module';
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
    LikeModule,
    CommentModule,
  ],
})
export class AppModule {}
