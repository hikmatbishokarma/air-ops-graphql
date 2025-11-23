import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
    @Field()
    ticketId: string;

    @Field()
    message: string;

    @Field()
    author: string;

    @Field(() => [String], { nullable: true, defaultValue: [] })
    attachments?: string[];
}
