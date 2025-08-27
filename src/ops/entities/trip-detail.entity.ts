import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ _id: false })
export class AssignmentCrewEntity {
  @Prop()
  designation: string;
  @Prop()
  crews: string[];
}

@Schema({ _id: false })
export class DocumentEntity {
  @Prop()
  type: string;

  @Prop()
  externalLink: string;

  @Prop()
  fileUrl: string;
}

@Schema({ _id: false })
export class FuelRecordEntity {
  @Prop()
  fuelStation: string;

  @Prop()
  uploadedDate: Date;

  @Prop()
  fuelOnArrival: string;

  @Prop()
  fuelLoaded: string;

  @Prop()
  fuelGauge: string;

  @Prop()
  handledBy: string;

  @Prop()
  designation: string;
}

@Schema()
export class TripSectorEntity {
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

  @Prop({ type: [AssignmentCrewEntity], default: [] })
  assignedCrews: AssignmentCrewEntity[];

  @Prop({ type: [DocumentEntity], default: [] })
  documents: DocumentEntity[];

  @Prop({ type: FuelRecordEntity })
  fuelRecord: FuelRecordEntity;
}

const SectorSchema = SchemaFactory.createForClass(TripSectorEntity);

@Schema({ collection: 'trip-details', timestamps: true })
export class TripDetailEntity extends BaseEntity {
  @Prop({ required: true })
  tripId: string;
  @Prop({
    ref: 'QuotesEntity',
    type: SchemaTypes.ObjectId,
    required: true,
    unique: true,
  })
  quotation: Types.ObjectId;

  @Prop({ required: true, unique: true })
  quotationNo: string;

  @Prop({ type: [TripSectorEntity], default: [] })
  sectors: TripSectorEntity[];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'OperatorEntity',
    default: undefined,
  })
  operatorId: Types.ObjectId;
}

export const TripDetailSchema = SchemaFactory.createForClass(TripDetailEntity);
