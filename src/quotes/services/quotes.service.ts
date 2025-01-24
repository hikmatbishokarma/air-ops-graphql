import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseQueryService } from '@app/query-mongoose';
import { QuotesEntity } from '../entities/quotes.entity';

@Injectable()
export class QuotesService extends MongooseQueryService<QuotesEntity> {
  constructor(@InjectModel(QuotesEntity.name) model: Model<QuotesEntity>) {
    super(model);
  }
}
