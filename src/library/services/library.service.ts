import { MongooseQueryService } from '@app/query-mongoose';
import { LibraryEntity } from '../entities/library.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LibraryService extends MongooseQueryService<LibraryEntity> {
  constructor(
    @InjectModel(LibraryEntity.name)
    private readonly model: Model<LibraryEntity>,
  ) {
    super(model);
  }
}
