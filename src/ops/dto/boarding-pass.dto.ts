import { InputType, ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType()
export class BoardingPassPassengerDto {
    @Field()
    name: string;

    @Field({ nullable: true })
    gender?: string;

    @Field({ nullable: true })
    age?: string;

    @Field({ nullable: true })
    govtId?: string;
}

@ObjectType()
export class BoardingPassFlightDto {
    @Field()
    fromCode: string;

    @Field()
    fromCity: string;

    @Field()
    toCode: string;

    @Field()
    toCity: string;

    @Field()
    departureDate: Date;

    @Field()
    departureTime: string;

    @Field()
    arrivalDate: Date;

    @Field()
    arrivalTime: string;

    @Field({ nullable: true })
    flightTime?: string;

    @Field(() => GraphQLJSONObject)
    aircraft: object;
}

@ObjectType()
export class GroundHandlerInfoDto {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    phone: string;

    @Field()
    airportCode: string;
}

@ObjectType()
export class GroundHandlersDto {
    @Field(() => GraphQLJSONObject, { nullable: true })
    source?: object;

    @Field(() => GraphQLJSONObject, { nullable: true })
    destination?: object;
}

@ObjectType('BoardingPass')
export class BoardingPassDto extends BaseDTO {
    @Field()
    boardingPassId: string;

    @Field()
    tripId: string;

    @Field()
    quotationNo: string;

    @Field(() => Int)
    sectorNo: number;

    @Field(() => BoardingPassPassengerDto)
    passenger: BoardingPassPassengerDto;

    @Field(() => BoardingPassFlightDto)
    flight: BoardingPassFlightDto;

    @Field(() => GroundHandlersDto, { nullable: true })
    groundHandlers?: GroundHandlersDto;

    @Field()
    operationType: string;

    @Field()
    status: string;
}

@InputType()
export class GenerateBoardingPassInput {
    @Field()
    tripId: string;

    @Field(() => Int)
    sectorNo: number;
}
