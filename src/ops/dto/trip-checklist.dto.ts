import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ChecklistItemDto {
    @Field()
    name: string;

    @Field()
    status: boolean;
}

@ObjectType()
export class ChecklistLocationDto {
    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    code: string;

    @Field({ nullable: true })
    city: string;
}

@ObjectType()
export class SectorChecklistDto {
    @Field(() => Int)
    sectorNo: number;

    @Field(() => ChecklistLocationDto, { nullable: true })
    source: ChecklistLocationDto;

    @Field(() => ChecklistLocationDto, { nullable: true })
    destination: ChecklistLocationDto;

    @Field(() => [ChecklistItemDto], { nullable: true })
    checklist: ChecklistItemDto[];
}

@ObjectType()
export class TripChecklistDto {
    @Field(() => [SectorChecklistDto])
    sectors: SectorChecklistDto[];
}
