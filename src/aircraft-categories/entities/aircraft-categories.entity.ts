import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'aircraft-categories', timestamps: true })
export class AircraftCategoriesEntity extends BaseEntity {
  @Prop({ type: String, required: true })
  name: string;
  @Prop()
  description: string;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'OperatorEntity',
    default: undefined,
  })
  operatorId: Types.ObjectId;
}

export const AircraftCategoriesSchema = SchemaFactory.createForClass(
  AircraftCategoriesEntity,
);

AircraftCategoriesSchema.index({ name: 1, operatorId: 1 }, { unique: true });
