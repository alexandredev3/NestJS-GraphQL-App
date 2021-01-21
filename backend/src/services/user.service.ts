import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../entities/User';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  public async createUser(data: ICreateUserDTO): Promise<User> {
    const userCreated = this.userRepository.create(data);

    await this.userRepository.save(userCreated);

    return userCreated;
  }

  public async findById(id: string): Promise<User> {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    return userFound;
  }

  public async findByEmail(email: string): Promise<User> {
    const userFound = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    return userFound;
  }

  public async findMany(): Promise<User[]> {
    const users = await this.userRepository.find();

    return users;
  }
}
