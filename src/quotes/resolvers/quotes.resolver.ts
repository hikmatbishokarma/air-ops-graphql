import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QuotesService } from '../services/quotes.service';
import {
  CalenderData,
  CalenderDataResponse,
  QuotesDto,
} from '../dto/quotes.dto';
import { UpdateQuoteStatusInput } from '../inputs/updatee-quote-status.input';

import { UpdateOneQuoteInput } from '../inputs/update-quote.input';
import { SaleConfirmationInput } from '../inputs/sale-confirmation.input';

@Resolver()
export class QuotesResolver {
  constructor(private readonly quotesService: QuotesService) {}

  @Query(() => [QuotesDto])
  async RequestedQuoteList() {
    return await this.quotesService.RequestedQuoteList();
  }

  @Mutation(() => QuotesDto)
  async updateQuotationStatus(@Args('input') input: UpdateQuoteStatusInput) {
    const { id, status } = input;
    return this.quotesService.updateQuotationStatus(id, status);
  }

  @Mutation(() => QuotesDto)
  async upgradeQuote(@Args('code') code: string) {
    return this.quotesService.upgrade(code);
  }

  @Query(() => String)
  async showPreview(@Args('quotationNo') quotationNo: string) {
    return await this.quotesService.preview(quotationNo);
  }

  @Mutation(() => QuotesDto, {
    name: 'updateOneQuote',
    description: 'Update one Quote ',
  })
  async updateOneQuote(@Args('input') input: UpdateOneQuoteInput) {
    return await this.quotesService.updateOneQuote(input);
  }

  @Mutation(() => QuotesDto)
  async saleConfirmation(@Args('args') args: SaleConfirmationInput) {
    return await this.quotesService.saleConfirmation(args);
  }

  @Query(() => [CalenderData])
  async flightSegmentsForCalendar(
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
    @Args('operatorId', { nullable: true }) operatorId: string,
  ) {
    return await this.quotesService.flightSegmentsForCalendar({
      startDate,
      endDate,
      operatorId,
    });
  }
}
