import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';

async function bootstrap(): Promise<void> {
  const app: NestFastifyApplication =
    await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
      {
        cors: {
          origin: '*',
          credentials: true,
          allowedHeaders: ['Content-Type', 'Authorization'],
          methods: ['GET', 'POST', 'PUT', 'PATCH'],
        },
      },
    );

  app.useGlobalPipes(new ValidationPipe());
  await app.register(fastifyCookie as any, {
    secret: 'jwt',
  });

  await app.listen(4000);
}
bootstrap();
