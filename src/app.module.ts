import { Module } from '@nestjs/common';
import { AtGuard } from '@/utils/guards/at.guard';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';
import { ProductsModule } from '@/products/products.module';
import { TokensModule } from '@/auth/tokens/tokens.module';
import { AuthModule } from '@/auth/auth.module';
import { CategoriesModule } from '@/categories/categories.module';
import { VendorsModule } from '@/vendors/vendors.module';

@Module({
  imports: [
    AuthModule,
    TokensModule,
    PrismaModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    VendorsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
