import { forwardRef, Module } from '@nestjs/common';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { ProductsModule } from '@/products/products.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [forwardRef(() => ProductsModule), UsersModule],
  exports: [VendorsService],
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule {}
