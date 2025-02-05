import { Query, Resolver } from '@nestjs/graphql';
import { QuotesService } from '../services/quotes.service';
import { QuotesDto } from '../dto/quotes.dto';

@Resolver()
export class QuotesResolver {
  constructor(private readonly quotesService: QuotesService) {}

  @Query(() => [QuotesDto])
  async RequestedQuoteList() {
    return await this.quotesService.RequestedQuoteList();
  }
}
