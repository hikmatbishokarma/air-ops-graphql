import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QuotesService } from '../services/quotes.service';
import { QuotesDto } from '../dto/quotes.dto';
import { UpdateQuoteStatusInput } from '../inputs/updatee-quote-status.input';
import { acknowledgementInput } from '../../notification/inputs/acknowledgement.input';
import { GenerateInvoiceInput } from '../inputs/generate-invoice.input';
import { UpdateOneInputType } from '@app/query-graphql';
import { UpdateOneQuoteInput } from '../inputs/update-quote.input';

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
}
