import { resolve } from 'path';

import { Module, Global, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Like from '../entities/Like';
import Post from '../entities/Post';
import User from '../entities/User';
import { EnvService } from '../services/env.service';
import { EnvModule } from './env.module';

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
    entities: [User, Post, Like],
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
