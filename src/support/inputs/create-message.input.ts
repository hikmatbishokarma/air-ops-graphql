import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
    @Field()
    ticketId: string;

    @Field()
    message: string;

    @Field()
    authorId: string;

    @Field(() => [String], { nullable: true, defaultValue: [] })
    attachments?: string[];

    @Field({ nullable: true, defaultValue: () => new Date() })
    createdAt?: Date;
}
