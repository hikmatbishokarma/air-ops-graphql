import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TicketEntity } from '../entities/ticket.entity';
import { CreateMessageInput } from '../inputs/create-message.input';
import { MongooseQueryService } from '@app/query-mongoose';
import { SystemNotificationService } from 'src/notification/services/system.service';
import { RolesService } from 'src/roles/services/roles.service';
import { RoleType } from 'src/app-constants/enums';
import { CrewDetailService } from 'src/crew-details/services/crew-detail.service';
import { MailerService } from 'src/notification/services/mailer.service';

@Injectable()
export class SupportService extends MongooseQueryService<TicketEntity> {
    constructor(
        @InjectModel(TicketEntity.name)
        private readonly ticketModel: Model<TicketEntity>,
        private readonly notificationService: SystemNotificationService,
        private readonly rolesService: RolesService,
        private readonly crewService: CrewDetailService,
        private readonly mailerService: MailerService,
    ) {
        super(ticketModel);
    }

    /**
     * Override createOne to send notifications when a ticket is created
     */
    async createOne(input: any): Promise<TicketEntity> {
        const ticket = await super.createOne(input);

        // Send notification to ADMIN and SUPPORT roles for the operator
        await this.notifyTicketCreation(ticket);

        return ticket;
    }

    /**
     * Add a message to a ticket and send appropriate notifications
     */
    async addMessageToTicket(input: CreateMessageInput): Promise<TicketEntity> {
        const { ticketId, message, authorId, attachments } = input;

        const ticket = await this.ticketModel.findByIdAndUpdate(
            ticketId,
            {
                $push: {
                    messages: {
                        message,
                        authorId: new Types.ObjectId(authorId),
                        attachments: attachments || [],
                        createdAt: new Date(),
                    },
                },
            },
            { new: true },
        ).populate('requester').exec();

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        // Check if the author is ADMIN or SUPPORT, then notify the requester
        await this.notifyMessageReply(ticket, new Types.ObjectId(authorId));

        return ticket;
    }

    /**
     * Update ticket metadata (status, priority, etc.) without touching messages
     * This ensures the messages array is never affected by status/priority updates
     */
    async updateTicketMetadata(
        ticketId: string,
        updates: { status?: string; priority?: string; subject?: string; department?: string }
    ): Promise<TicketEntity> {
        // Use $set to only update specified fields, never touching messages
        const ticket = await this.ticketModel.findByIdAndUpdate(
            ticketId,
            { $set: updates },
            { new: true }
        ).exec();

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        return ticket;
    }

    /**
     * Notify ADMIN and SUPPORT roles when a ticket is created
     */
    private async notifyTicketCreation(ticket: TicketEntity): Promise<void> {
        try {
            let recipientRoles: RoleType[] = [];

            if (ticket.operatorId) {
                // Ticket has an operator - notify ADMIN and SUPPORT for that operator
                // Note: Based on the enums, we don't have a SUPPORT role type, so we'll just use ADMIN
                recipientRoles = [RoleType.ADMIN];
            } else {
                // No operator - notify all SUPER_ADMINs
                recipientRoles = [RoleType.SUPER_ADMIN];
            }

            await this.notificationService.createSystemNotification({
                title: 'New Support Ticket',
                message: `New ticket created: ${ticket.subject}`,
                type: 'TICKET_CREATED',
                refType: 'Ticket',
                refId: ticket._id.toString(),
                recipientRoles,
                metadata: {
                    ticketId: ticket._id.toString(),
                    subject: ticket.subject,
                    department: ticket.department,
                    priority: ticket.priority,
                    operatorId: ticket.operatorId?.toString(),
                },
            });
        } catch (error) {
            console.error('[SupportService] Error sending ticket creation notification:', error);
        }
    }

    /**
     * Notify the ticket requester when ADMIN/SUPPORT replies
     */
    private async notifyMessageReply(ticket: TicketEntity, authorId: Types.ObjectId): Promise<void> {
        try {
            // Check if the author is the requester
            if (ticket.requester && authorId.toString() === ticket.requester.toString()) {
                // Requester is replying to their own ticket, no notification needed
                return;
            }

            // Get the author's details to check their role
            const author = await this.crewService.getById(authorId.toString());

            if (!author || !author.roles || author.roles.length === 0) {
                return;
            }

            // Get the author's roles
            const roleIds = author.roles.map(r => new Types.ObjectId(r.toString()));
            const authorRoles = await this.rolesService['model'].find({
                _id: { $in: roleIds }
            }).exec();

            // Check if author has ADMIN, SUPER_ADMIN, or other support roles
            const isAdminOrSupport = authorRoles.some(role =>
                role.type === RoleType.ADMIN ||
                role.type === RoleType.SUPER_ADMIN
            );

            if (isAdminOrSupport && ticket.requester) {
                // Admin/Support is replying - notify the requester
                await this.notificationService.createSystemNotification({
                    title: 'Support Ticket Reply',
                    message: `You have a new reply on your ticket: ${ticket.subject}`,
                    type: 'TICKET_REPLY',
                    refType: 'Ticket',
                    refId: ticket._id.toString(),
                    recipientIds: [ticket.requester.toString()],
                    metadata: {
                        ticketId: ticket._id.toString(),
                        subject: ticket.subject,
                        authorId: authorId.toString(),
                    },
                });

                // Send email notification to the requester
                await this.sendReplyEmail(ticket, author);
            }
        } catch (error) {
            console.error('[SupportService] Error sending message reply notification:', error);
        }
    }

    /**
     * Send email notification to ticket requester when support replies
     */
    private async sendReplyEmail(ticket: TicketEntity, author: any): Promise<void> {
        try {
            // Get the requester's details to fetch email
            // Note: ticket.requester is an ObjectId, we need to populate it
            const populatedTicket = await this.ticketModel
                .findById(ticket._id)
                .populate('requester')
                .exec();

            const requester = populatedTicket?.requester as any;

            if (!requester || !requester.email) {
                console.warn('[SupportService] Requester email not found, skipping email notification');
                return;
            }

            // Get the latest message (the reply)
            const latestMessage = ticket.messages[ticket.messages.length - 1];

            const subject = `New Reply on Your Support Ticket: ${ticket.subject}`;
            const text = `You have received a new reply on your support ticket.`;

            // Create HTML email content
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #1F5B98; color: white; padding: 20px; text-align: center; }
                        .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
                        .ticket-info { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #1F5B98; }
                        .message-box { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px; }
                        .status { background-color: #E9F3FF; color: #1F5B98; }
                        .priority { background-color: #FFF4E5; color: #D97A05; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Support Ticket Reply</h2>
                        </div>
                        <div class="content">
                            <p>Hello ${requester.fullName || requester.displayName},</p>
                            <p>You have received a new reply on your support ticket from our support team.</p>
                            
                            <div class="ticket-info">
                                <h3>${ticket.subject}</h3>
                                <p>
                                    <span class="badge status">${ticket.status}</span>
                                    <span class="badge priority">${ticket.priority}</span>
                                </p>
                                <p><strong>Department:</strong> ${ticket.department}</p>
                            </div>
                            
                            <div class="message-box">
                                <p><strong>Reply from ${author.fullName || author.displayName}:</strong></p>
                                <p>${latestMessage.message}</p>
                            </div>
                            
                            <p>Please log in to your account to view the full conversation and respond.</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated message from AirOps Support System.</p>
                            <p>Please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            await this.mailerService.sendEmail(
                requester.email,
                subject,
                text,
                html
            );


        } catch (error) {
            console.error('[SupportService] Error sending reply email:', error);
            // Don't throw - email failure shouldn't break the notification flow
        }
    }
}
