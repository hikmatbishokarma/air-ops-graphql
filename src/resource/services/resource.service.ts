import { MongooseQueryService } from '@app/query-mongoose';
import { Injectable } from '@nestjs/common';
import { ResourceEntity } from '../entities/resource.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ResourceService extends MongooseQueryService<ResourceEntity> {
  constructor(@InjectModel(ResourceEntity.name) model: Model<ResourceEntity>) {
    super(model);
  }
}
