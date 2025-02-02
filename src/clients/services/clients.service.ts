import { MongooseQueryService } from '@app/query-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ClientsEntity } from '../entities/clients.entity';

@Injectable()
export class ClientsService extends MongooseQueryService<ClientsEntity> {
  constructor(@InjectModel(ClientsEntity.name) model: Model<ClientsEntity>) {
    super(model);
  }
}
