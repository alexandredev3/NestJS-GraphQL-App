import * as faker from 'faker';
import * as request from 'supertest';
import { getRepository, Repository } from 'typeorm';

import { INestApplication } from '@nestjs/common';

import User from '../src/entities/User';
import { HashService } from '../src/services/hash.service';
import appModuleTest from './modules/appModuleTest';

describe('User Resolver', () => {
  let app: INestApplication;
  let hashService: HashService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const appModule = await appModuleTest();

    app = appModule.createNestApplication();
    hashService = appModule.get<HashService>(HashService);
    userRepository = getRepository(User);
    await app.init();
  });

  describe('root', () => {
    it('should hash the password', async () => {
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

    it('should not return true when the password the user passes does not match the password saved in the database', async () => {
      const randomName = faker.name.findName();
      const randomEmail = faker.internet.email();
      const randomPassword = faker.internet.password(12);
      const wrongPassword = 'wrongpassword12345678';

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
        wrongPassword,
        password
      );

      expect(hashCompare).toEqual(false);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
