import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { SchemaTypes, Types } from 'mongoose';

import { BaseEntity } from 'src/common/entities/base.entity';

// Define the schema for a single meal
@Schema({ _id: false })
export class MealEntity {
  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  portions: number;

  @Prop({ required: true })
  item: string;

  @Prop()
  instructions?: string;
}
const MealSchema = SchemaFactory.createForClass(MealEntity);

@Schema({ _id: false })
export class PassengerEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  age: number;

  @Prop()
  aadharId?: string;
}
const PassengerSchema = SchemaFactory.createForClass(PassengerEntity);

@Schema({ _id: false })
export class TravelEntity {
  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  seatingCapacity: number;

  @Prop()
  vehicleChoice?: string;

  @Prop()
  dropAt?: string;
}
const TravelSchema = SchemaFactory.createForClass(TravelEntity);
@Schema()
export class SectorEntity {
  @Prop()
  sectorNo: number;
  @Prop()
  source: string;

  @Prop()
  destination: string;

  @Prop({ type: Date, required: true })
  depatureDate: Date;

  @Prop()
  depatureTime: string;

  @Prop({ type: Date, required: true })
  arrivalDate: Date;

  @Prop()
  arrivalTime: string;

  @Prop()
  pax: number;
  @Prop()
  flightTime: string;

  @Prop({ type: [PassengerEntity] })
  passengers: PassengerEntity[];

  @Prop({ type: [MealEntity] })
  meals: MealEntity[];

  @Prop({ type: TravelEntity })
  travel: TravelEntity;
}

const SectorSchema = SchemaFactory.createForClass(SectorEntity);
@Schema({ collection: 'passenger-details', timestamps: true })
export class PassengerDetailEntity extends BaseEntity {
  @Prop({
    ref: 'QuotesEntity',
    type: SchemaTypes.ObjectId,
    required: true,
    unique: true,
  })
  quotation: Types.ObjectId;

  @Prop({ required: true, unique: true })
  quotationNo: string;

  @Prop({ type: [SectorEntity], default: [] })
  sectors: SectorEntity[];
  // @Prop({ type: [PassengerEntity] })
  // passengers: PassengerEntity[];

  // @Prop({ type: [MealEntity] })
  // meals: MealEntity[];

  // @Prop({ type: TravelEntity })
  // travel: TravelEntity;

  // @Prop({ type: mongoose.Schema.Types.Mixed })
  // meta: object;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'OperatorEntity',
    default: undefined,
  })
  operatorId: Types.ObjectId;
}

export const PassengerDetailSchema = SchemaFactory.createForClass(
  PassengerDetailEntity,
);
