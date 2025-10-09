import { Mutation, Resolver } from '@nestjs/graphql';
import { CountryService } from '../services/country.service';
import { GraphQLJSONObject } from 'graphql-type-json';

@Resolver()
export class CountryResolver {
  constructor(private readonly countryService: CountryService) {}

  @Mutation(() => GraphQLJSONObject)
  async syncCountries() {
    return this.countryService.syncCountries();
  }
}
