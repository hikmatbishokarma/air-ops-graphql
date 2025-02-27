import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'aircrafts', timestamps: true })
export class AircraftsEntity extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
  @Prop({
    ref: 'AircraftCategoriesEntity',
    type: SchemaTypes.ObjectId,
    required: true,
  })
  category: Types.ObjectId;
  @Prop()
  description: string;
  @Prop()
  image: string;
  @Prop({ type: [Object] })
  specifications: Object[];
  @Prop()
  termsAndConditions: string;
}

export const AircraftsSchema = SchemaFactory.createForClass(AircraftsEntity);
