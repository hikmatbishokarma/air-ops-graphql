import { MongooseQueryService } from '@app/query-mongoose';
import { RoleEntity } from '../entities/roles.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesService extends MongooseQueryService<RoleEntity> {
  constructor(@InjectModel(RoleEntity.name) model: Model<RoleEntity>) {
    super(model);
  }
}
