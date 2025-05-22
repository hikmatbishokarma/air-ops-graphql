import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'aircraft-categories', timestamps: true })
export class AircraftCategoriesEntity extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
  @Prop()
  description: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'AgentEntity', default: undefined })
  agentId: Types.ObjectId;
}

export const AircraftCategoriesSchema = SchemaFactory.createForClass(
  AircraftCategoriesEntity,
);
