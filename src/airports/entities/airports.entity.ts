import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ _id: false, timestamps: false })
export class groundHandlersInfoEntity {
  @Prop()
  fullName: string;
  @Prop()
  companyName: string;
  @Prop({ unique: true })
  contactNumber: string;
  @Prop({ unique: true })
  email: string;
}

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
  @Prop()
  country: string;
  @Prop()
  openHrs: string;
  @Prop()
  closeHrs: string;
  @Prop()
  contactNumber: string;
  @Prop()
  email: string;
  @Prop({ type: [groundHandlersInfoEntity] })
  groundHandlersInfo: groundHandlersInfoEntity[];
}

export const AirportsSchema = SchemaFactory.createForClass(AirportsEntity);
