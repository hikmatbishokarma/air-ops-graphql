import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IntimationDocument = IntimationEntity & Document;

@Schema({ timestamps: true })
export class IntimationEntity {
    @Prop({ required: true })
    tripId: string;

    @Prop({ required: true })
    sectorNo: number;

    @Prop({
        type: String,
        enum: ['APD', 'ATC', 'Terminal', 'Re Fuel', 'CISF', 'Airport Operator', 'Ground Handler'],
        required: true
    })
    recipientType: string;

    @Prop({ required: true })
    toEmail: string;

    @Prop({ required: true })
    subject: string;

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
