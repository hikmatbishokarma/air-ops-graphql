import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class OpsDashboardDto {
    @Field(() => Int)
    saleConfirmations: number;

    @Field(() => Int)
    tripDetails: number;

    @Field(() => Int)
    crewTripsDoc: number;

    @Field(() => Int)
    reports: number;
}
