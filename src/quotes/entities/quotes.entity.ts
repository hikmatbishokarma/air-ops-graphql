import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { Category, QuoteStatus } from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';
import { PricesDto } from 'src/price/entities/price.entity';

@Schema({ _id: false })
export class ItineraryEntity {
  @Prop({ required: true })
  source: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ type: Date, required: true })
  depatureDate: Date;

  @Prop({ required: true })
  depatureTime: string;

  @Prop({ type: Date, required: true })
  arrivalDate: Date;

  @Prop({ required: true })
  arrivalTime: string;

  @Prop({ required: true })
  paxNumber: number;
}

const ItinerarySchema = SchemaFactory.createForClass(ItineraryEntity);

@Schema({ collection: 'quotes', timestamps: true })
export class QuotesEntity extends BaseEntity {
  @Prop({ ref: 'ClientsEntity', type: SchemaTypes.ObjectId, required: true })
  requestedBy: Types.ObjectId;
  @Prop({ ref: 'RepresentativeEntity', type: SchemaTypes.ObjectId })
  representative: Types.ObjectId;

  // @Prop({
  //   ref: 'AircraftCategoriesEntity',
  //   type: SchemaTypes.ObjectId,
  //   required: true,
  // })
  // category: Types.ObjectId;

  @Prop({ type: String, enum: Category })
  category: Category;

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

  // @Prop({ type: [Object], required: true })
  // itinerary: Object[];

  @Prop({ type: [ItineraryEntity], required: true })
  itinerary: ItineraryEntity[];

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

  // @Prop()
  // proformaInvoiceNo: string;
  // @Prop({ default: 0 })
  // proformaInvoiceRevision: number;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'OperatorEntity',
    default: undefined,
  })
  operatorId: Types.ObjectId;

  @Prop()
  confirmationTemplate?: string;
}

export const QuotesSchema = SchemaFactory.createForClass(QuotesEntity);
