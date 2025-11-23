import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GeneratePassengerManifestInput {
    @Field()
    tripId: string;

    @Field(() => Int)
    sectorNo: number;
}
