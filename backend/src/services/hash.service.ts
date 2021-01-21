import { hash, compare } from 'bcryptjs';

import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  async generateHash(payload: string): Promise<string> {
    const payloadHash = await hash(payload, 8);

    return payloadHash;
  }

  async compareHash(payload: string, password: string): Promise<boolean> {
    const compareHash = await compare(payload, password);

    return compareHash;
  }
}
