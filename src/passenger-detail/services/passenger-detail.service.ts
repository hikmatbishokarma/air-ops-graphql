import { MongooseQueryService } from '@app/query-mongoose';
import { PassengerDetailEntity } from '../entities/passenger-detail.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class PassengerDetailService extends MongooseQueryService<PassengerDetailEntity> {
  constructor(
    @InjectModel(PassengerDetailEntity.name)
    private readonly model: Model<PassengerDetailEntity>,
  ) {
    super(model);
  }

  async updatePassengerDetail(args) {
    const { where, data } = args;

    if (!data) {
      throw new BadRequestException('Data to push cannot be empty.');
    }

    console.log('where::::', where, data?.sector);

    try {
      const updatedPassengerDetail = await this.model.findOneAndUpdate(
        where,
        { $push: { sectors: data?.sector } },
        { new: true }, // Return the updated document
      );

      console.log('updatedPassengerDetail:::', updatedPassengerDetail);

      if (!updatedPassengerDetail) {
        throw new BadRequestException('Passenger detail not found.');
      }

      return updatedPassengerDetail;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update passenger details.',
      );
    }
  }
}
