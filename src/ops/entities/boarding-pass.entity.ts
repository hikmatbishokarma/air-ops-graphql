import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';
import { TripDetailStatus } from 'src/app-constants/enums';

@Schema({ _id: false })
export class BoardingPassPassenger {
    @Prop({ required: true })
    name: string;

    @Prop()
    gender: string;

    @Prop()
    age: string; // Keeping as string to match existing patterns, or number? Manifest has age.

    @Prop()
    govtId: string; // Masked ID
}

@Schema({ _id: false })
export class BoardingPassFlight {
    @Prop({ required: true })
    fromCode: string;

    @Prop({ required: true })
    fromCity: string;

    @Prop({ required: true })
    toCode: string;

    @Prop({ required: true })
    toCity: string;

    @Prop({ required: true })
    departureDate: Date;

    @Prop({ required: true })
    departureTime: string;

    @Prop({ required: true })
    arrivalDate: Date;

    @Prop({ required: true })
    arrivalTime: string;

    @Prop()
    flightTime: string;

    @Prop({ type: Object })
    aircraft: object;
}

@Schema({ _id: false })
export class GroundHandlerInfo {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop()
    airportCode: string;
}

// @Schema({ _id: false })
// export class GroundHandlers {
//     @Prop({ type: GroundHandlerInfo, required: false })
//     source?: GroundHandlerInfo;

//     @Prop({ type: GroundHandlerInfo, required: false })
//     destination?: GroundHandlerInfo;
// }

@Schema({ collection: 'boarding-passes', timestamps: true })
export class BoardingPassEntity extends BaseEntity {
    @Prop({ required: true, unique: true })
    boardingPassId: string; // Unique ID for the document

    @Prop({ required: true })
    tripId: string; // Link to Trip

    @Prop({ type: SchemaTypes.ObjectId, ref: 'TripDetailEntity', required: true })
    tripObjectId: Types.ObjectId;

    @Prop({ required: true })
    quotationNo: string; // Link to Quotation

    @Prop({ required: true })
    sectorNo: number;

    @Prop({ type: BoardingPassPassenger, required: true })
    passenger: BoardingPassPassenger;

    @Prop({ type: BoardingPassFlight, required: true })
    flight: BoardingPassFlight;

    @Prop({ type: Object, required: false })
    groundHandlers?: object;

    @Prop({ default: 'NON-SCHEDULED' })
    operationType: string;

    @Prop({ default: 'Issued' })
    status: string;
}

export const BoardingPassSchema = SchemaFactory.createForClass(BoardingPassEntity);
