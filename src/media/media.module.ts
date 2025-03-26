import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MediaController } from './media.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: './media/files', // configService.get<string>('multer_dest.test'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MediaController],
})
export class MediaModule {}
