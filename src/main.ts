import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  app.use('/media', express.static(join(__dirname, '..', 'media')));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // await app.listen(port);

  await app.listen(port, '0.0.0.0'); // ✅ Ensure external access
}
bootstrap();
