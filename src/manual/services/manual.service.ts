import { MongooseQueryService } from '@app/query-mongoose';
import { ManualEntity } from '../entities/manual.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ManualService extends MongooseQueryService<ManualEntity> {
  constructor(
    @InjectModel(ManualEntity.name)
    private readonly model: Model<ManualEntity>,
  ) {
    super(model);
  }
}
