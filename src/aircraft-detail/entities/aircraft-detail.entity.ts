import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'aircraft-details', timestamps: true })
export class AircraftDetailEntity extends BaseEntity {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  code: string;

  @Prop()
  description: string;

  @Prop({ type: [Object] })
  specifications: Object[];

  @Prop()
  termsAndConditions: string;

  @Prop()
  noteText: string;
  // @Prop()
  // warningText: string;
  @Prop()
  warningImage: string;
  @Prop()
  flightImage: string;
  @Prop()
  seatLayoutImage: string;
  @Prop()
  rangeMapImage: string;

  @Prop()
  flightInteriorImages: [string];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'OperatorEntity',
    default: undefined,
  })
  operatorId: Types.ObjectId;
}

export const AircraftDetailSchema =
  SchemaFactory.createForClass(AircraftDetailEntity);

AircraftDetailSchema.index({ code: 1, operatorId: 1 }, { unique: true });



AircraftDetailSchema.virtual('operator', {
  ref: 'OperatorEntity',
  localField: 'operatorId',
  foreignField: '_id',
  justOne: true,
});
