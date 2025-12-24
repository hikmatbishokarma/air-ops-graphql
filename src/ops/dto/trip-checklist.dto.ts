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
    @Field()
    name: string;

    @Field()
    code: string;

    @Field()
    city: string;
}

@ObjectType()
export class SectorChecklistDto {
    @Field(() => Int)
    sectorNo: number;

    @Field(() => ChecklistLocationDto)
    source: ChecklistLocationDto;

    @Field(() => ChecklistLocationDto)
    destination: ChecklistLocationDto;

    @Field(() => [ChecklistItemDto])
    checklist: ChecklistItemDto[];
}

@ObjectType()
export class TripChecklistDto {
    @Field(() => [SectorChecklistDto])
    sectors: SectorChecklistDto[];
}
