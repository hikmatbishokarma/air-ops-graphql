import { MongooseQueryService } from '@app/query-mongoose';
import { Injectable } from '@nestjs/common';
import { AircraftsEntity } from '../entities/aircrafts.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AircraftsService extends MongooseQueryService<AircraftsEntity> {
  constructor(
    @InjectModel(AircraftsEntity.name)
    model: Model<AircraftsEntity>,
  ) {
    super(model);
  }
}
