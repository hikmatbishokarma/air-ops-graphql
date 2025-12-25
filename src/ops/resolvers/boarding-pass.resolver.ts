import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { BoardingPassService } from '../services/boarding-pass.service';
import { BoardingPassDto, GenerateBoardingPassInput } from '../dto/boarding-pass.dto';

@Resolver(() => BoardingPassDto)
@UseGuards(GqlAuthGuard)
export class BoardingPassResolver {
    constructor(private readonly boardingPassService: BoardingPassService) { }

    @Mutation(() => [BoardingPassDto])
    async generateBoardingPass(
        @Args('input') input: GenerateBoardingPassInput,
    ): Promise<BoardingPassDto[]> {
        console.log("input::::", input)
        return this.boardingPassService.generateBoardingPass(input) as any;
    }

    @Query(() => [BoardingPassDto])
    async getBoardingPasses(
        @Args('tripId') tripId: string,
        @Args('sectorNo') sectorNo: number,
    ): Promise<BoardingPassDto[]> {
        return this.boardingPassService.getBoardingPasses(tripId, sectorNo) as any;
    }
}
