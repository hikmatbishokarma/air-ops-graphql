import { MongooseQueryService } from '@app/query-mongoose';
import { TripDetailEntity } from '../entities/trip-detail.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import moment from 'moment';
import { QuotesService } from 'src/quotes/services/quotes.service';
import { QuoteStatus } from 'src/app-constants/enums';

@Injectable()
export class TripDetailService extends MongooseQueryService<TripDetailEntity> {
  constructor(
    @InjectModel(TripDetailEntity.name)
    private readonly model: Model<TripDetailEntity>,
    private readonly quotesService: QuotesService,
  ) {
    super(model);
  }

  async generateTripId(operatorId) {
    const today = moment().format('YYMMDD');

    const lastTrip = await this.model
      .findOne({
        tripId: { $regex: new RegExp(`^${today}`) },
        operatorId: operatorId,
      })
      .sort({ tripId: -1 });

    let sequentialNumber = 1;
    if (lastTrip) {
      const lastSequential = parseInt(lastTrip.tripId.slice(-2), 10);
      sequentialNumber = lastSequential + 1;
    }

    // Pad to 3 digits to handle numbers from 001 to 999
    const paddedSequentialNumber = String(sequentialNumber).padStart(2, '0');

    const newTripId = `${today}${paddedSequentialNumber}`;
    return newTripId;
  }

  async updateTripDetail(args) {
    const { where, data } = args;

    if (!data || !data.sector || !data.sector.sectorNo) {
      throw new BadRequestException('Invalid data or sector No provided.');
    }

    const { sectorNo } = data.sector;

    try {
      const tripDetail = await this.model.findOne(where);

      if (!tripDetail) {
        throw new BadRequestException('Trip detail not found.');
      }

      // Find the index of the existing sector by its ID
      const sectorIndex = tripDetail.sectors.findIndex(
        (sector) => sector.sectorNo === sectorNo,
      );

      let updatedTripDetail;

      if (sectorIndex > -1) {
        // Case 1: Sector already exists, so update it
        const updatePath = `sectors.${sectorIndex}`;
        updatedTripDetail = await this.model.findOneAndUpdate(
          where,
          { $set: { [updatePath]: data.sector } },
          { new: true },
        );
      } else {
        // Case 2: Sector does not exist, so push a new one
        updatedTripDetail = await this.model.findOneAndUpdate(
          where,
          { $push: { sectors: data.sector } },
          { new: true },
        );
      }

      if (!updatedTripDetail) {
        // This check is a safeguard in case the document was removed
        throw new BadRequestException(
          'Passenger detail not found during update.',
        );
      }

      await this.quotesService.updateOne(tripDetail.quotation.toString(), {
        status: QuoteStatus.TRIP_GENERATED,
      });
      return updatedTripDetail;
    } catch (error) {
      console.error('Failed to update trip details:', error);
      throw new InternalServerErrorException('Failed to update trip details.');
    }
  }

  async createTrip(input) {
    try {
      const { operatorId, ...rest } = input.tripDetail;

      const tripId = await this.generateTripId(operatorId);

      rest.sectors = rest.sectors.map((sector, idx) => ({
        ...sector,
        sectorNo: idx + 1,
      }));

      rest.tripId = tripId;

      const result = await this.createOne({ ...rest, operatorId });
      if (!result) {
        throw new Error(`Failed to create trip`);
      }

      await this.quotesService.updateOne(result.quotation.toString(), {
        status: QuoteStatus.TRIP_GENERATED,
      });

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
