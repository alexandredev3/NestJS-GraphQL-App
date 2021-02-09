import { classToClass } from 'class-transformer';
import { Repository } from 'typeorm';

import { HttpException, Injectable, Inject, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../entities/User';
import { HashService } from './hash.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(HashService) private hashService: HashService
  ) {}

  public async createUser(data: ICreateUserDTO): Promise<User> {
    const { email, name, password } = data;

    const userExists = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (userExists) {
      throw new HttpException('User already exists.', HttpStatus.BAD_REQUEST);
    }

    const passwordHash = await this.hashService.generateHash(password);

    const user = this.userRepository.create({
      name,
      email,
      password: passwordHash,
    });

    await this.userRepository.save(user);

    return classToClass(user);
  }

  public async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find();

    return classToClass(users);
  }

  public async getUniqueUser(user_id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      relations: ['posts'],
    });

    if (!user) {
      throw new HttpException('User does not exists.', HttpStatus.BAD_REQUEST);
    }

    return user;
  }
}
