import * as faker from 'faker';
import * as request from 'supertest';
import { getRepository, Repository } from 'typeorm';

import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import User from '../src/entities/User';
import { OrmModule } from '../src/modules/orm.module';
import { UserModule } from '../src/modules/user.module';
import { HashService } from '../src/services/hash.service';

describe('UserResolver', () => {
  let app: INestApplication;
  let hashService: HashService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const userModuleTest: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([User]),
        OrmModule,
        UserModule,
        GraphQLModule.forRoot({
          autoSchemaFile: 'schema.sql',
        }),
      ],
    }).compile();

    app = userModuleTest.createNestApplication();
    hashService = userModuleTest.get<HashService>(HashService);
    userRepository = getRepository(User);
    await app.init();
  });

  describe('root', () => {
    it('should create a new user', async () => {
      const randomName = faker.name.findName();
      const randomEmail = faker.internet.email();
      const randomPassword = faker.internet.password(12);

      await request(app.getHttpServer())
        .post('/graphql')
        .type('form')
        .set('Accept', 'application/json')
        .send({
          query: `mutation {
            createUser(name: "${randomName}", email: "${randomEmail}", password: "${randomPassword}") {
              id
              name
            }
          }`,
        });

      const { password } = await userRepository.findOne({
        where: {
          email: randomEmail,
        },
      });

      const hashCompare = await hashService.compareHash(
        randomPassword,
        password
      );

      expect(hashCompare).toEqual(true);
    });
    afterAll(async () => {
      await app.close();
    });
  });
});
