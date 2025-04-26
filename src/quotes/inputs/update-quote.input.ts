import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { QuotesDto } from '../dto/quotes.dto';
import { UpdateOneInputType } from '@app/query-graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { QuoteStatus } from 'src/app-constants/enums';
import { PriceInputDto } from 'src/price/dto/price.dto';

@InputType()
export class UpdateQuoteDTO {
  @Field({ nullable: true })
  requestedBy: string;
  @Field()
  representative: string;
  @Field()
  category: string;
  @Field()
  aircraft: string;
  @Field()
  providerType: string;
  @Field(() => [GraphQLJSONObject])
  itinerary: Object[];

  @Field(() => [PriceInputDto])
  prices: PriceInputDto[];
  @Field(() => Float, { defaultValue: 0 })
  grandTotal: number;
}

@InputType()
export class UpdateOneQuoteInput extends UpdateOneInputType(
  QuotesDto,
  UpdateQuoteDTO,
) {}
