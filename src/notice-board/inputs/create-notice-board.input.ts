import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateNoticeBoardInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    message: string;

    @Field(() => Date)
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @Field(() => Date)
    @IsDate()
    @Type(() => Date)
    endDate: Date;

    @Field(() => Boolean, { nullable: true })
    @IsOptional()
    isActive?: boolean;
}
