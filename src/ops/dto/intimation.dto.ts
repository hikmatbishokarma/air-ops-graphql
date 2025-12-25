import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IntimationDto {
    @Field()
    _id: string;

    @Field()
    tripId: string;

    @Field(() => Int)
    sectorNo: number;

    @Field()
    recipientType: string;

    @Field()
    toEmail: string;

    @Field()
    subject: string;

    @Field({ nullable: true })
    note?: string;

    @Field({ nullable: true })
    attachmentUrl?: string;

    @Field()
    status: string;

    @Field({ nullable: true })
    sentAt?: Date;

    @Field({ nullable: true })
    sentBy?: string;

    @Field({ nullable: true })
    errorMessage?: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

@InputType()
export class CreateIntimationInput {
    @Field()
    tripId: string;

    @Field(() => Int)
    sectorNo: number;

    @Field()
    recipientType: string;

    @Field()
    toEmail: string;

    @Field()
    subject: string;

    @Field({ nullable: true })
    note?: string;

    @Field({ nullable: true })
    attachmentUrl?: string;
}

@InputType()
export class UpdateIntimationInput {
    @Field({ nullable: true })
    toEmail?: string;

    @Field({ nullable: true })
    subject?: string;

    @Field({ nullable: true })
    note?: string;

    @Field({ nullable: true })
    attachmentUrl?: string;
}

@InputType()
export class SendIntimationInput {
    @Field()
    intimationId: string;
}
