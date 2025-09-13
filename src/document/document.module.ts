import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { QuotesModule } from 'src/quotes/quotes.module';

@Module({
  imports: [QuotesModule],
  providers: [],
  controllers: [DocumentController],
})
export class DocumentModule {}
