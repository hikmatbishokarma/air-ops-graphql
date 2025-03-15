import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'counters' }) // Explicitly setting the collection name
export class Counter extends Document {
  @Prop({ required: true, unique: true })
  year: number;

  @Prop({ required: true, default: 0 })
  serial: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
