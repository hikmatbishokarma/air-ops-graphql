import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

export class Segment {
  @Prop({ ref: 'LocationEntity', type: SchemaTypes.ObjectId, required: true })
  source: Types.ObjectId;

  @Prop({ ref: 'LocationEntity', type: SchemaTypes.ObjectId, required: true })
  destination: Types.ObjectId;

  @Prop({ type: Date, required: true })
  departureDate: Date;

  @Prop({ type: Number, required: true, min: 1 })
  pax: number;

  @Prop()
  aircraft: string;
}

const SegmentSchema = SchemaFactory.createForClass(Segment);

@Schema({ collection: 'quotes', timestamps: true })
export class QuotesEntity extends BaseEntity {
  @Prop({ ref: 'RequesterEntity', type: SchemaTypes.ObjectId, required: true })
  requestedBy: Types.ObjectId;
  @Prop({
    ref: 'RepresentativeEntity',
    type: SchemaTypes.ObjectId,
    required: true,
  })
  representative: Types.ObjectId;
  @Prop()
  category: string;

  @Prop({ type: [SegmentSchema], required: true }) // Embedding the segments array
  segments: Segment[];
}

export const QuotesSchema = SchemaFactory.createForClass(QuotesEntity);
