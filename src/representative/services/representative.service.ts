import { MongooseQueryService } from '@app/query-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { RepresentativeEntity } from '../entities/representative.entity';

@Injectable()
export class RepresentativeService extends MongooseQueryService<RepresentativeEntity> {
  constructor(
    @InjectModel(RepresentativeEntity.name) model: Model<RepresentativeEntity>,
  ) {
    super(model);
  }
}
