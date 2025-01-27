import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'airports', timestamps: true })
export class AirportsEntity extends BaseEntity {
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

export const AirportsSchema = SchemaFactory.createForClass(AirportsEntity);
