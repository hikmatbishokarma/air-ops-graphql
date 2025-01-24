import { MongooseQueryService } from '@app/query-mongoose';
import { Injectable } from '@nestjs/common';
import { AircraftCategoriesEntity } from '../entities/aircraft-categories.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AircraftCategoriesService extends MongooseQueryService<AircraftCategoriesEntity> {
  constructor(
    @InjectModel(AircraftCategoriesEntity.name)
    model: Model<AircraftCategoriesEntity>,
  ) {
    super(model);
  }
}
