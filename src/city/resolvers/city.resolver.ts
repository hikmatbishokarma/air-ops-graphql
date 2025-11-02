import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { GraphQLJSONObject } from 'graphql-type-json';
import { CityService } from '../services/city.service';
import { StateService } from '../services/state.service';

@Resolver()
export class CityResolver {
  constructor(
    private readonly cityService: CityService,
    private readonly stateService: StateService,
  ) {}

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

  @Mutation(() => GraphQLJSONObject)
  async syncStatesByCountry(@Args('countryCode') countryCode: string) {
    return this.stateService.syncStatesByCountry(countryCode);
  }
}
