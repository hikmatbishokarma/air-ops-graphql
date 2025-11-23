import { Field, InputType } from '@nestjs/graphql';
import { TicketStatus, TicketPriority } from 'src/app-constants/enums';

@InputType()
export class CreateTicketInput {
    @Field(() => TicketStatus)
    status: TicketStatus;

    @Field(() => TicketPriority)
    priority: TicketPriority;

    @Field()
    department: string;

    @Field()
    requester: string;
}
