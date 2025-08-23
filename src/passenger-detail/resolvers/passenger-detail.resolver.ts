import { Res } from '@nestjs/common';
import { PassengerDetailService } from '../services/passenger-detail.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  UpdatePassengerDetailDataInput,
  UpdatePassengerDetailWhereInput,
} from '../inputs/update-passenger-detail.input';
import { PassengerDetailDto } from '../dto/passenger-detail.dto';

@Resolver()
export class PassengerDetailResolver {
  constructor(private readonly passengerDetail: PassengerDetailService) {}

  @Mutation(() => PassengerDetailDto)
  async updatePassengerDetail(
    @Args('where') where: UpdatePassengerDetailWhereInput,
    @Args('data') data: UpdatePassengerDetailDataInput,
  ) {
    return await this.passengerDetail.updatePassengerDetail({ where, data });
  }
}
