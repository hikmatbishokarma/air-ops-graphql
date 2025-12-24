import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { TripDetailStatus, TripSectorStatus } from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';
import { sectorLocationEntity } from 'src/quotes/entities/quotes.entity';

@Schema({ _id: false })
export class tripDocByCrew {
  @Prop()
  name: string;

  @Prop()
  url: string;

  @Prop()
  type: string;

  @Prop({ ref: 'CrewDetailEntity', type: SchemaTypes.ObjectId, required: true })
  crew: Types.ObjectId;
}

@Schema({ _id: false })
export class AssignmentCrewEntity {
  @Prop()
  designation: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'CrewDetailEntity', default: [] })
  crews: Types.ObjectId[];
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
  fuelReceipt: string;

  @Prop()
  handledBy: string;

  @Prop()
  designation: string;
}

@Schema({ _id: false })
export class BaReportEntity {
  @Prop()
  name: string;

  @Prop()
  reading: string;

  @Prop()
  conductedDate: Date;

  @Prop()
  record: string;

  @Prop()
  video?: string;
}

@Schema({ _id: false }) // embedded schema, not a standalone collection
export class BaPersonEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  age: string;

  @Prop({ required: true })
  certNo: string;
}

@Schema({ _id: false })
export class BaInfoEntity {
  @Prop()
  baMachine: string;

  @Prop({ type: [BaPersonEntity], default: undefined })
  baPersons: BaPersonEntity[];

  @Prop({ type: [BaReportEntity], default: undefined })
  baReports: BaReportEntity[];
}

@Schema()
export class TripSectorEntity {
  @Prop()
  sectorNo: number;

  // @Prop()
  // source: string;

  // @Prop()
  // destination: string;

  // source: string;

  @Prop({ type: sectorLocationEntity, required: true })
  source: sectorLocationEntity;

  @Prop({ type: sectorLocationEntity, required: true })
  destination: sectorLocationEntity;

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

  @Prop({ type: BaInfoEntity })
  baInfo: BaInfoEntity;

  @Prop({ type: [tripDocByCrew], default: [] })
  tripDocByCrew: tripDocByCrew[];

  @Prop({ type: String, enum: TripSectorStatus, default: TripSectorStatus.IN_PROGRESS })
  status: TripSectorStatus;
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

  @Prop({ type: String, enum: TripDetailStatus, default: TripDetailStatus.DRAFT })
  status: TripDetailStatus;
}

export const TripDetailSchema = SchemaFactory.createForClass(TripDetailEntity);



TripDetailSchema.virtual('operator', {
  ref: 'OperatorEntity',
  localField: 'operatorId',
  foreignField: '_id',
  justOne: true,
});
