import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'aircraft-details', timestamps: true })
export class AircraftDetailEntity extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
  @Prop({ type: String, required: true, unique: true })
  code: string;
  @Prop({
    ref: 'AircraftCategoriesEntity',
    type: SchemaTypes.ObjectId,
    required: true,
  })
  category: Types.ObjectId;
  @Prop()
  description: string;

  @Prop({ type: [Object] })
  specifications: Object[];
  @Prop()
  termsAndConditions: string;
  @Prop()
  noteText: string;
  @Prop()
  warningText: string;
  @Prop()
  warningImage: string;
  @Prop()
  flightImages: string;
  @Prop()
  seatLayoutImage: string;
  @Prop()
  rangeMapImage: string;
}

export const AircraftDetailSchema =
  SchemaFactory.createForClass(AircraftDetailEntity);
