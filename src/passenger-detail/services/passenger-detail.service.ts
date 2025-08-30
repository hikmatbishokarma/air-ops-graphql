import { MongooseQueryService } from '@app/query-mongoose';
import { PassengerDetailEntity } from '../entities/passenger-detail.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { QuotesService } from 'src/quotes/services/quotes.service';
import { QuoteStatus } from 'src/app-constants/enums';

@Injectable()
export class PassengerDetailService extends MongooseQueryService<PassengerDetailEntity> {
  constructor(
    @InjectModel(PassengerDetailEntity.name)
    private readonly model: Model<PassengerDetailEntity>,
    @Inject(forwardRef(() => QuotesService))
    private readonly quotesService: QuotesService,
  ) {
    super(model);
  }

  // async updatePassengerDetail(args) {
  //   const { where, data } = args;

  //   if (!data) {
  //     throw new BadRequestException('Data to push cannot be empty.');
  //   }

  //   console.log('where::::', where, data?.sector);

  //   try {
  //     const updatedPassengerDetail = await this.model.findOneAndUpdate(
  //       where,
  //       { $push: { sectors: data?.sector } },
  //       { new: true }, // Return the updated document
  //     );

  //     console.log('updatedPassengerDetail:::', updatedPassengerDetail);

  //     if (!updatedPassengerDetail) {
  //       throw new BadRequestException('Passenger detail not found.');
  //     }

  //     return updatedPassengerDetail;
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       'Failed to update passenger details.',
  //     );
  //   }
  // }

  async updatePassengerDetail(args) {
    const { where, data } = args;

    if (!data || !data.sector || !data.sector.sectorNo) {
      throw new BadRequestException('Invalid data or sector ID provided.');
    }

    const { sectorNo } = data.sector;

    try {
      const passengerDetail = await this.model.findOne(where);

      if (!passengerDetail) {
        throw new BadRequestException('Passenger detail not found.');
      }

      // Find the index of the existing sector by its ID
      const sectorIndex = passengerDetail.sectors.findIndex(
        (sector) => sector.sectorNo === sectorNo,
      );

      let updatedPassengerDetail;

      if (sectorIndex > -1) {
        // Case 1: Sector already exists, so update it
        const updatePath = `sectors.${sectorIndex}`;
        updatedPassengerDetail = await this.model.findOneAndUpdate(
          where,
          { $set: { [updatePath]: data.sector } },
          { new: true },
        );
      } else {
        // Case 2: Sector does not exist, so push a new one
        updatedPassengerDetail = await this.model.findOneAndUpdate(
          where,
          { $push: { sectors: data.sector } },
          { new: true },
        );
      }

      if (!updatedPassengerDetail) {
        // This check is a safeguard in case the document was removed
        throw new BadRequestException(
          'Passenger detail not found during update.',
        );
      }

      await this.quotesService.updateOne(where.quotation, {
        status: QuoteStatus.PAX_ADDED,
      });

      return updatedPassengerDetail;
    } catch (error) {
      console.error('Failed to update passenger details:', error);
      throw new InternalServerErrorException(
        'Failed to update passenger details.',
      );
    }
  }
}
