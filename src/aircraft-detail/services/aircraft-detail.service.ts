import { MongooseQueryService } from '@app/query-mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AircraftDetailEntity } from '../entities/aircraft-detail.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuotesService } from 'src/quotes/services/quotes.service';

@Injectable()
export class AircraftDetailService extends MongooseQueryService<AircraftDetailEntity> {
  constructor(
    @InjectModel(AircraftDetailEntity.name)
    model: Model<AircraftDetailEntity>,
    @Inject(forwardRef(() => QuotesService))
    private readonly quotesService: QuotesService,
  ) {
    super(model);
  }

  async checkIfAircraftDetailPresentInQuote(id) {
    const quotes = await this.quotesService.query({
      filter: { aircraft: { eq: id } },
      projection: { aircraft: 1, id: 1, quotationNo: 1 }, // Ensure quotationNo is returned
    });

    if (quotes.length > 0) {
      // Extract the quotation numbers for the message
      const quoteNumbers = quotes
        .map((q) => q.quotationNo)
        .filter((qn) => qn)
        .join(', ');

      // 2. Construct the Error Message
      if (quoteNumbers.length > 0) {
        throw new Error(
          `Cannot delete this aircraft. It is currently linked to the following Quotation(s): ${quoteNumbers}. Please remove the aircraft from these quotes before attempting deletion.`,
        );
      } else {
        // Fallback for quotes without a quotationNo (shouldn't happen, but good practice)
        throw new Error(
          `Cannot delete this aircraft. It is currently linked to ${quotes.length} active quotation(s).`,
        );
      }
    }
  }
}
