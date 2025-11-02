import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'states', timestamps: true })
export class StateEntity extends BaseEntity {
  @Prop()
  name: string;

  @Prop({ required: true })
  isoCode: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: false, type: String })
  latitude?: string;

  @Prop({ required: false, type: String })
  longitude?: string;
}

export const StateSchema = SchemaFactory.createForClass(StateEntity);
