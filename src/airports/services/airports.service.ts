import { MongooseQueryService } from '@app/query-mongoose';
import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AirportsEntity } from '../entities/airports.entity';

@Injectable()
export class AirportsService extends MongooseQueryService<AirportsEntity> {
  constructor(
    @InjectModel(AirportsEntity.name)
    model: Model<AirportsEntity>,
  ) {
    super(model);
  }
}
