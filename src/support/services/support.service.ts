import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketEntity } from '../entities/ticket.entity';
import { CreateMessageInput } from '../inputs/create-message.input';

@Injectable()
export class SupportService {
    constructor(
        @InjectModel(TicketEntity.name)
        private readonly ticketModel: Model<TicketEntity>,
    ) { }

    async addMessageToTicket(input: CreateMessageInput): Promise<TicketEntity> {
        const { ticketId, message, author, attachments } = input;

        const ticket = await this.ticketModel.findByIdAndUpdate(
            ticketId,
            {
                $push: {
                    messages: {
                        message,
                        author,
                        attachments: attachments || [],
                        createdAt: new Date(),
                    },
                },
            },
            { new: true },
        ).exec();

        return ticket;
    }
}
