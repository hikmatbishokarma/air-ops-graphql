import { InjectModel } from '@nestjs/mongoose';
import { CrewDetailEntity } from '../entities/crew-detail.entity';
import { Model } from 'mongoose';
import { MongooseQueryService } from '@app/query-mongoose';

export class CrewDetailService extends MongooseQueryService<CrewDetailEntity> {
  constructor(
    @InjectModel(CrewDetailEntity.name)
    private readonly model: Model<CrewDetailEntity>,
  ) {
    super(model);
  }
}
