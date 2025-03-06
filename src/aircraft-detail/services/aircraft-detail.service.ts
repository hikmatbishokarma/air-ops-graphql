import { MongooseQueryService } from '@app/query-mongoose';
import { Injectable } from '@nestjs/common';
import { AircraftDetailEntity } from '../entities/aircraft-detail.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AircraftDetailService extends MongooseQueryService<AircraftDetailEntity> {
  constructor(
    @InjectModel(AircraftDetailEntity.name)
    model: Model<AircraftDetailEntity>,
  ) {
    super(model);
  }
}
