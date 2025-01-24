import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'aircraft-categories', timestamps: true })
export class AircraftCategoriesEntity extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
  @Prop()
  description: string;
}

export const AircraftCategoriesSchema = SchemaFactory.createForClass(
  AircraftCategoriesEntity,
);
