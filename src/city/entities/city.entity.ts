import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'cities', timestamps: true })
export class CityEntity extends BaseEntity {
  @Prop()
  name: string;
  @Prop()
  state: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  stateCode: string;

  @Prop({ required: false, type: String })
  latitude?: string;

  @Prop({ required: false, type: String })
  longitude?: string;
}

export const CitySchema = SchemaFactory.createForClass(CityEntity);
