import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'airpots', timestamps: true })
export class AirpotsEntity extends BaseEntity {
  @Prop()
  name: string;
  @Prop()
  iata_code: string;
  @Prop()
  icao_code: string;
  @Prop()
  latitude: number;
  @Prop()
  longitude: number;
  @Prop()
  city: string;
}

export const AirpotsSchema = SchemaFactory.createForClass(AirpotsEntity);
