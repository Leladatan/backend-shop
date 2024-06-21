import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  constructor() {}

  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }
}
