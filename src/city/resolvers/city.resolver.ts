import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { GraphQLJSONObject } from 'graphql-type-json';
import { CityService } from '../services/city.service';

@Resolver()
export class CityResolver {
  constructor(private readonly cityService: CityService) {}

  @Mutation(() => GraphQLJSONObject)
  async syncCitiesByCountry(@Args('countryCode') countryCode: string) {
    return this.cityService.syncCitiesByCountry(countryCode);
  }

  @Mutation(() => GraphQLJSONObject)
  async syncCitiesByStateCode(
    @Args('countryCode') countryCode: string,
    @Args('stateCode') stateCode: string,
  ) {
    return this.cityService.syncCitiesByStateCode(countryCode, stateCode);
  }
}
