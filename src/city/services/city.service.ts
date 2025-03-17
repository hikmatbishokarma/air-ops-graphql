import { MongooseQueryService } from '@app/query-mongoose';
import { CityEntity } from '../entities/city.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class CityService extends MongooseQueryService<CityEntity> {
  constructor(
    @InjectModel(CityEntity.name)
    model: Model<CityEntity>,
  ) {
    super(model);
  }
}
