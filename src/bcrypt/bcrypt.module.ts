import { Module } from '@nestjs/common';
import { BcryptService } from '@/bcrypt/bcrypt.service';

@Module({
  exports: [BcryptService],
  providers: [BcryptService],
})
export class BcryptModule {}
