import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  // await app.listen(port);
  console.log('MongoDB URI:', process.env.MONGODB_URI);
  await app.listen(port, '0.0.0.0'); // ✅ Ensure external access
}
bootstrap();
