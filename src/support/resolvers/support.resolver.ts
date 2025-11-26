import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { SupportService } from '../services/support.service';
import { MessageDto, TicketDto } from '../dto/ticket.dto';
import { CreateMessageInput } from '../inputs/create-message.input';
import { CrewDetailService } from 'src/crew-details/services/crew-detail.service';
import { CrewDetailDto } from 'src/crew-details/dto/crew-detail.dto';

@Resolver(() => TicketDto)
export class SupportResolver {
    constructor(private readonly supportService: SupportService) { }

    @Mutation(() => TicketDto)
    async addMessageToTicket(@Args('input') input: CreateMessageInput) {
        return await this.supportService.addMessageToTicket(input);
    }
}

@Resolver(() => MessageDto)
export class MessageResolver {
    constructor(private readonly crewService: CrewDetailService) { }

    @ResolveField(() => CrewDetailDto, { name: 'author' })
    async getAuthor(@Parent() message: any) {
        if (!message.authorId) return null;
        return await this.crewService.findById(message.authorId);
    }
}
