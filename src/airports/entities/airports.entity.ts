import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AirportType } from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ _id: false, timestamps: false })
export class groundHandlersInfoEntity {
  @Prop()
  fullName: string;
  @Prop()
  companyName: string;
  @Prop({ unique: true })
  contactNumber: string;
  @Prop()
  alternateContactNumber: string;
  @Prop({ unique: true })
  email: string;
}

@Schema({ _id: false, timestamps: false })
export class fuelSupplierEntity {
  @Prop()
  companyName: string;
  @Prop({ unique: true })
  contactNumber: string;
  @Prop()
  alternateContactNumber: string;
  @Prop({ unique: true })
  email: string;
}


@Schema({ _id: false, timestamps: false })
export class LocationEntity {
  @Prop({ type: String, enum: ['Point'], default: 'Point' })
  type: string;

  @Prop({ type: [Number], index: '2dsphere' })
  coordinates: number[]; // [longitude, latitude]
}

@Schema({ collection: 'airports', timestamps: true })
export class AirportsEntity extends BaseEntity {
  @Prop({ index: true })
  name: string;
  @Prop({ index: true })
  iata_code: string;
  @Prop({ index: true })
  icao_code: string;
  @Prop()
  latitude: string;
  @Prop()
  longitude: string;

  @Prop({ type: LocationEntity, index: '2dsphere' })
  location: LocationEntity;

  @Prop({ index: true })
  city: string;
  @Prop()
  state: string;
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

  @Prop({ type: [fuelSupplierEntity] })
  fuelSuppliers: fuelSupplierEntity[];

  // @Prop({ type: String, enum: AirportType, default: AirportType.CIVIL })
  // type: AirportType;
  @Prop()
  type: string;

  @Prop()
  elevation: number;
  @Prop()
  approaches: string;
  @Prop()
  longestPrimaryRunway: string;
  @Prop()
  runwaySurface: string;
  @Prop()
  airportLightIntensity: string;
  @Prop()
  airportOfEntry: string;
  @Prop()
  fireCategory: string;
  @Prop()
  slotsRequired: string;
  @Prop()
  handlingMandatory: string;
}

export const AirportsSchema = SchemaFactory.createForClass(AirportsEntity);

AirportsSchema.index({ location: '2dsphere' });

const parseCoordinate = (coord: string | number | undefined): number | null => {
  if (typeof coord === 'number') return coord;
  if (!coord) return null;

  const trimmed = coord.trim();

  const regexLegacy = /^([NSEW])(\d+)-([\d.]+)$/i;
  const matchLegacy = trimmed.match(regexLegacy);
  if (matchLegacy) {
    const [, dir, deg, min] = matchLegacy;
    let decimal = parseInt(deg, 10) + parseFloat(min) / 60;
    if (dir.toUpperCase() === 'S' || dir.toUpperCase() === 'W') {
      decimal *= -1;
    }
    return decimal;
  }

  const regexSuffix = /^([\d.]+)[°º]?\s*([NSEW])$/i;
  const matchSuffix = trimmed.match(regexSuffix);
  if (matchSuffix) {
    const [, val, dir] = matchSuffix;
    let decimal = parseFloat(val);
    if (dir.toUpperCase() === 'S' || dir.toUpperCase() === 'W') {
      decimal *= -1;
    }
    return decimal;
  }

  const simple = parseFloat(trimmed);
  return isNaN(simple) ? null : simple;
};

AirportsSchema.pre('save', function (next) {
  if (this.latitude && this.longitude) {
    const lat = parseCoordinate(this.latitude);
    const long = parseCoordinate(this.longitude);
    if (lat !== null && long !== null) {
      this.location = {
        type: 'Point',
        coordinates: [long, lat],
      };
    }
  }
  next();
});
