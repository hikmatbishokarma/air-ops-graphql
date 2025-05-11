import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { QuoteStatus } from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';
import { PricesDto } from 'src/price/entities/price.entity';

export class Segment {
  @Prop({ ref: 'LocationEntity', type: SchemaTypes.ObjectId, required: true })
  source: Types.ObjectId;

  @Prop({ ref: 'LocationEntity', type: SchemaTypes.ObjectId, required: true })
  destination: Types.ObjectId;

  @Prop({ type: Date, required: true })
  departureDate: Date;

  @Prop({ type: Number, required: true, min: 1 })
  pax: number;
}

const SegmentSchema = SchemaFactory.createForClass(Segment);

@Schema({ collection: 'quotes', timestamps: true })
export class QuotesEntity extends BaseEntity {
  @Prop({ ref: 'ClientsEntity', type: SchemaTypes.ObjectId, required: true })
  requestedBy: Types.ObjectId;
  @Prop({ ref: 'RepresentativeEntity', type: SchemaTypes.ObjectId })
  representative: Types.ObjectId;

  @Prop({
    ref: 'AircraftCategoriesEntity',
    type: SchemaTypes.ObjectId,
    required: true,
  })
  category: Types.ObjectId;

  @Prop({
    ref: 'AircraftDetailEntity',
    type: SchemaTypes.ObjectId,
    required: false,
  })
  aircraft: Types.ObjectId;

  @Prop()
  providerType: string;

  @Prop({ required: true })
  quotationNo: string;

  // @Prop()
  // revisedQuotationNo: string;

  @Prop({ type: [Object], required: true })
  itinerary: Object[];

  @Prop({ type: String, enum: QuoteStatus, default: QuoteStatus.QUOTE })
  status: QuoteStatus;

  @Prop({ type: [PricesDto] })
  prices: PricesDto[];
  @Prop()
  grandTotal: number;

  @Prop({ default: 1 })
  version: number;
  @Prop({ default: true })
  isLatest: boolean;
  @Prop()
  code: string;

  @Prop({ default: 0 })
  revision: number;
  @Prop()
  proformaInvoiceNo: string;
  @Prop({ default: 0 })
  proformaInvoiceRevision: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'AgentEntity', default: undefined })
  agentId: Types.ObjectId;
}

export const QuotesSchema = SchemaFactory.createForClass(QuotesEntity);
