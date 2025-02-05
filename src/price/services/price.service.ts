import { MongooseQueryService } from '@app/query-mongoose';
import { Injectable } from '@nestjs/common';
import { PriceEntity } from '../entities/price.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PriceService extends MongooseQueryService<PriceEntity> {
  constructor(@InjectModel(PriceEntity.name) model: Model<PriceEntity>) {
    super(model);
  }
}
