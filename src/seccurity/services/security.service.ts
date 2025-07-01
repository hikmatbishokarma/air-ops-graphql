import { MongooseQueryService } from '@app/query-mongoose';
import { SecurityEntity } from '../entities/security.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SecurityService extends MongooseQueryService<SecurityEntity> {
  constructor(
    @InjectModel(SecurityEntity.name)
    private readonly model: Model<SecurityEntity>,
  ) {
    super(model);
  }
}
