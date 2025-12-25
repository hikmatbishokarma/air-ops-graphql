import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { IntimationService } from '../services/intimation.service';
import { IntimationDto, CreateIntimationInput, UpdateIntimationInput, SendIntimationInput } from '../dto/intimation.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CurrentUser } from 'src/users/current-user.decorator';

@Resolver(() => IntimationDto)
@UseGuards(GqlAuthGuard)
export class IntimationResolver {
    constructor(private readonly intimationService: IntimationService) { }

    @Mutation(() => IntimationDto)
    async createIntimation(
        @Args('input') input: CreateIntimationInput,
        @CurrentUser() user: any,
    ) {
        return await this.intimationService.createIntimation(input, user._id);
    }

    @Mutation(() => IntimationDto)
    async updateIntimation(
        @Args('id') id: string,
        @Args('input') input: UpdateIntimationInput,
    ) {
        return await this.intimationService.updateIntimation(id, input);
    }

    @Mutation(() => IntimationDto)
    async sendIntimation(
        @Args('input') input: SendIntimationInput,
        @CurrentUser() user: any,
    ) {
        return await this.intimationService.sendIntimation(input.intimationId, user._id);
    }

    @Mutation(() => Boolean)
    async deleteIntimation(@Args('id') id: string) {
        return await this.intimationService.deleteIntimation(id);
    }

    @Query(() => [IntimationDto])
    async getIntimationsBySector(
        @Args('tripId') tripId: string,
        @Args('sectorNo', { type: () => Int }) sectorNo: number,
    ) {
        return await this.intimationService.getIntimationsBySector(tripId, sectorNo);
    }

    @Query(() => [IntimationDto])
    async getIntimationsByTrip(@Args('tripId') tripId: string) {
        return await this.intimationService.getIntimationsByTrip(tripId);
    }
}
