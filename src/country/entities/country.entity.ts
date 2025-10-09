import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'countries', timestamps: true })
export class CountryEntity extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  isoCode: string;

  @Prop({ required: true })
  dialCode: string;

  @Prop({ required: false })
  emoji?: string;

  @Prop({ required: false })
  flagUrl?: string;

  @Prop({ required: false })
  currency?: string;

  @Prop({ required: false, type: String })
  latitude?: string;

  @Prop({ required: false, type: String })
  longitude?: string;

  @Prop({ required: false })
  timezone?: string;
}

export const CountrySchema = SchemaFactory.createForClass(CountryEntity);
