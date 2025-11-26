import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';
import { TicketStatus, TicketPriority } from 'src/app-constants/enums';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ _id: false })
export class MessageEntity {
    @Prop({ required: true })
    message: string;

    @Prop({
        ref: 'CrewDetailEntity',
        type: SchemaTypes.ObjectId,
        required: true,
    })
    authorId: Types.ObjectId;

    @Prop({ type: [String], default: [] })
    attachments: string[];

    @Prop({ default: () => new Date() })
    createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(MessageEntity);

@Schema({ collection: 'tickets' })
export class TicketEntity extends BaseEntity {
    @Prop({ type: String, enum: TicketStatus, required: true })
    status: TicketStatus;

    @Prop({ type: String, enum: TicketPriority, required: true })
    priority: TicketPriority;

    @Prop({ required: true })
    subject: string;

    @Prop({ required: true })
    department: string;


    @Prop({ type: [MessageSchema], default: [] })
    messages: MessageEntity[];

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: 'OperatorEntity',
        default: undefined,
    })
    operatorId: Types.ObjectId;

    @Prop({
        ref: 'CrewDetailEntity',
        type: SchemaTypes.ObjectId,
        required: true,
    })
    requester?: Types.ObjectId;
}

export const TicketSchema = SchemaFactory.createForClass(TicketEntity);
TicketSchema.virtual('operator', {
    ref: 'OperatorEntity',
    localField: 'operatorId',
    foreignField: '_id',
    justOne: true,
});
