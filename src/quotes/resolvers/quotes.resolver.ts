import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QuotesService } from '../services/quotes.service';
import { QuotesDto } from '../dto/quotes.dto';
import { UpdateQuoteStatusInput } from '../inputs/updatee-quote-status.input';
import { GenerateQuotePdfInput } from '../inputs/generate-quote-pdf.input';

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

  @Mutation(() => String)
  async generateQuotePdf(@Args('input') input: GenerateQuotePdfInput) {
    return await this.quotesService.generateQuotePdf(input);
  }
}
