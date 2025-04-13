import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CounterType } from 'src/app-constants/enums';

@Schema({ collection: 'counters' }) // Explicitly setting the collection name
export class Counter extends Document {
  @Prop({ required: true, unique: true })
  year: number;

  @Prop({ required: true, default: 0 })
  serial: number;

  @Prop({ required: true, type: String,enum:CounterType })
  type:string
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
