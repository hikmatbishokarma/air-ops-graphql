import { Injectable } from '@nestjs/common';
import { UserDTO } from '../dto/users.dto';

import { UserEntity } from '../entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseQueryService } from '@app/query-mongoose';

@Injectable()
export class UsersService extends MongooseQueryService<UserEntity> {
  constructor(@InjectModel(UserEntity.name) model: Model<UserEntity>) {
    super(model);
  }

  private readonly users = [
    {
      id: 1,
      name: 'john',
      password: 'changeme',
    },
    {
      id: 2,
      name: 'maria',
      password: 'guess',
    },
  ];

  // async findOne(username: string): Promise<UserDTO | undefined> {
  //   return this.users.find((user) => user.name === username);
  // }
}
