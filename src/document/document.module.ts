import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { QuotesModule } from 'src/quotes/quotes.module';
import { PassengerDetailModule } from 'src/passenger-detail/passenger-detail.module';

@Module({
  imports: [QuotesModule, PassengerDetailModule],
  providers: [],
  controllers: [DocumentController],
})
export class DocumentModule {}
