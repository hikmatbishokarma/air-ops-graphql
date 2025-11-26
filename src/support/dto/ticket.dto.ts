import {
    FilterableField,
    PagingStrategies,
    QueryOptions,
    Relation,
} from '@app/query-graphql';
import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { TicketStatus, TicketPriority } from 'src/app-constants/enums';
import { OperatorDto } from 'src/operator/dto/operator.dto';
import { CrewDetailDto } from 'src/crew-details/dto/crew-detail.dto';

@ObjectType('Message')
@InputType('MessageInput')
export class MessageDto {

    @Field()
    message: string;

    @Field()
    authorId: string;

    @Field(() => CrewDetailDto, { name: 'author', nullable: true })
    author?: CrewDetailDto;

    @Field(() => [String], { defaultValue: [] })
    attachments: string[];

    @Field({ nullable: true })
    createdAt?: Date;
}

@ObjectType('Ticket', { description: 'Support Tickets' })
@QueryOptions({
    enableTotalCount: true,
    pagingStrategy: PagingStrategies.OFFSET,
})
@InputType()
@Relation('operator', () => OperatorDto, {
    disableRemove: true,
    nullable: true,
})

@Relation('requester', () => CrewDetailDto, {
    disableRemove: true,
    nullable: true,
})

export class TicketDto extends BaseDTO {
    @Field(() => ID)
    id!: string;

    @FilterableField(() => TicketStatus)
    status: TicketStatus;

    @FilterableField(() => TicketPriority)
    priority: TicketPriority;

    @FilterableField()
    subject: string;

    @FilterableField()
    department: string;

    @FilterableField()
    requester: string;

    @Field(() => [MessageDto], { defaultValue: [] })
    messages: MessageDto[];

    @FilterableField({ nullable: true })
    operatorId: string;
}
