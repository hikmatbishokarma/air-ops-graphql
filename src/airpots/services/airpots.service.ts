import { MongooseQueryService } from '@app/query-mongoose';
import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AirpotsEntity } from '../entities/airpots.entity';

@Injectable()
export class AirpotsService extends MongooseQueryService<AirpotsEntity> {
  constructor(
    @InjectModel(AirpotsEntity.name)
    model: Model<AirpotsEntity>,
  ) {
    super(model);
  }
}
