import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IntimationDocument = IntimationEntity & Document;

@Schema({ collection: 'intimations', timestamps: true })
export class IntimationEntity {
    @Prop({ required: true })
    tripId: string;

    @Prop({ required: true })
    sectorNo: number;

    @Prop({
        type: String,
        required: false
    })
    recipientType?: string;

    @Prop({ required: false })
    toEmail?: string;

    @Prop({ type: [String], default: [] })
    toEmails: string[];

    @Prop({ type: [String], default: [] })
    ccEmails: string[];

    @Prop({ required: false })
    subject?: string;

    @Prop({ required: false })
    template?: string;

    @Prop({ required: false })
    body?: string;

    @Prop({ required: false })
    note?: string;

    @Prop({ required: false })
    attachmentUrl?: string;

    @Prop({ enum: ['DRAFT', 'SENT', 'FAILED'], default: 'DRAFT' })
    status: string;

    @Prop({ required: false })
    sentAt?: Date;

    @Prop({ required: false })
    sentBy?: string;

    @Prop({ required: false })
    errorMessage?: string;
}

export const IntimationSchema = SchemaFactory.createForClass(IntimationEntity);
