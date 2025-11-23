import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { QuotesModule } from 'src/quotes/quotes.module';
import { PassengerDetailModule } from 'src/passenger-detail/passenger-detail.module';
import { TripDetailModule } from 'src/ops/operation.module';

@Module({
  imports: [QuotesModule, PassengerDetailModule, TripDetailModule],
  providers: [],
  controllers: [DocumentController],
})
export class DocumentModule { }
