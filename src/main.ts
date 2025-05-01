import { NestFactory } from '@nestjs/core';
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
  // await app.listen(port);
  console.log('MongoDB URI:', process.env.MONGODB_URI);
  await app.listen(port, '0.0.0.0'); // ✅ Ensure external access
}
bootstrap();
