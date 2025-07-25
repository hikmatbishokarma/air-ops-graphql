import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import {
  InvoiceType,
  PaymentStatus,
  QuoteStatus,
} from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'invoices', timestamps: true })
export class InvoiceEntity extends BaseEntity {
  @Prop({ ref: 'QuotesEntity', type: SchemaTypes.ObjectId, required: true })
  quotation: Types.ObjectId;

  @Prop({ required: true })
  quotationNo: string;

  @Prop({ default: true })
  isLatest: boolean;

  @Prop({ default: 0 })
  revision: number;
  @Prop({})
  proformaInvoiceNo: string;

  @Prop({})
  taxInvoiceNo: string;

  @Prop()
  template: string;

  @Prop({ type: String, enum: InvoiceType, required: true })
  type: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'OperatorEntity',
    default: undefined,
  })
  operatorId: Types.ObjectId;

  @Prop({
    type: String,
    enum: QuoteStatus,
    default: QuoteStatus.PROFOMA_INVOICE,
  })
  status: QuoteStatus;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;
}

export const InvoiceSchema = SchemaFactory.createForClass(InvoiceEntity);
