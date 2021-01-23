import { Repository } from 'typeorm';

import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import ISessionDTO from '../dtos/ISessionDTO';
import User from '../entities/User';
import { HashService } from './hash.service';

interface IResponse {
  id: string;
  name: string;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(HashService) private hashService: HashService,
    @Inject(JwtService) private jwtService: JwtService
  ) {}

  async authetication(data: ISessionDTO): Promise<IResponse> {
    const { email, password } = data;

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    const { id, name } = user;

    if (!user) {
      throw new HttpException('User does not exists.', HttpStatus.NOT_FOUND);
    }

    const hashCompare = await this.hashService.compareHash(
      password,
      user.password
    );

    if (!hashCompare) {
      throw new HttpException(
        'Password does not match',
        HttpStatus.UNAUTHORIZED
      );
    }

    const token = this.generateToken(id);

    return {
      id,
      name,
      token,
    };
  }

  generateToken(id: string): string {
    const payload = {
      user: {
        id,
      },
    };
    const token = this.jwtService.sign(payload);

    return token;
  }
}
