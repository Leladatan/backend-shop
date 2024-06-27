import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from '@/utils/guards/at.guard';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from '@/categories/products/products.module';
import { TokensModule } from '@/auth/tokens/tokens.module';

@Module({
  imports: [
    AuthModule,
    TokensModule,
    PrismaModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
