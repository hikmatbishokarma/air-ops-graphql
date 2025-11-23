import { Field, InputType } from '@nestjs/graphql';
import { TicketStatus, TicketPriority } from 'src/app-constants/enums';

@InputType()
export class UpdateTicketInput {
    @Field(() => TicketStatus, { nullable: true })
    status?: TicketStatus;

    @Field(() => TicketPriority, { nullable: true })
    priority?: TicketPriority;

    @Field({ nullable: true })
    department?: string;

    @Field({ nullable: true })
    requester?: string;
}
