import { MongooseQueryService } from '@app/query-mongoose';
import { PassengerDetailEntity } from '../entities/passenger-detail.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PassengerDetailService extends MongooseQueryService<PassengerDetailEntity> {
  constructor(
    @InjectModel(PassengerDetailEntity.name)
    private readonly model: Model<PassengerDetailEntity>,
  ) {
    super(model);
  }
}
