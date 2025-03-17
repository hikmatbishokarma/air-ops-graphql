import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'cities', timestamps: true })
export class CityEntity extends BaseEntity {
  @Prop()
  name: string;
  @Prop()
  state: string;
}

export const CitySchema = SchemaFactory.createForClass(CityEntity);
