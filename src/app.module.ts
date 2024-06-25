import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from '@/utils/guards/at.guard';
import { APP_GUARD } from '@nestjs/core';
import { TokensModule } from '@/tokens/tokens.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';
import { CategoriesService } from './categories/categories.service';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    AuthModule,
    TokensModule,
    PrismaModule,
    UsersModule,
    CategoriesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    CategoriesService,
  ],
})
export class AppModule {}
