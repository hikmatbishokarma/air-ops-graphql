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
import { QuoteStatus, TripFilterForCrewType } from 'src/app-constants/enums';
import { TripFilterForCrewInput } from '../inputs/crew-assigned-trip.input';
import { PagingInput } from 'src/common/inputs/paging.input';
import { SortInput } from 'src/common/inputs/sorting.input';
import { toObjectId } from 'src/common/helper';
import { skip } from 'node:test';

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

  async assignedSectorsForCrew(
    filter: TripFilterForCrewInput,
    paging: PagingInput,
    sort?: SortInput,
  ) {
    const now = new Date();

    const { crewId, type, search } = filter;

    const crewObjId = toObjectId(filter.crewId);

    const { limit, offset } = paging;

    const matchSearch = search
      ? {
          $or: [
            { 'sectors.source.code': { $regex: search, $options: 'i' } },
            { 'sectors.source.city': { $regex: search, $options: 'i' } },
            { 'sectors.destination.code': { $regex: search, $options: 'i' } },
            { 'sectors.destination.city': { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const sortStage = sort
      ? {
          $sort: {
            ...(sort.createdAt
              ? { createdAt: sort.createdAt === 'asc' ? 1 : -1 }
              : {}),
            ...(sort.updatedAt
              ? { updatedAt: sort.updatedAt === 'asc' ? 1 : -1 }
              : {}),
          },
        }
      : { $sort: { departureDateTime: 1 } };

    // const pipeline: any[] = [
    //   { $match: { 'sectors.assignedCrews.crews': userId } },
    //   { $unwind: '$sectors' },
    //   { $match: { 'sectors.assignedCrews.crews': userId } },
    //   { $match: matchSearch },

    //   {
    //     $addFields: {
    //       departureDateTime: {
    //         $dateFromString: {
    //           dateString: {
    //             $concat: [
    //               {
    //                 $dateToString: {
    //                   date: '$sectors.depatureDate',
    //                   format: '%Y-%m-%d',
    //                 },
    //               },
    //               'T',
    //               '$sectors.depatureTime',
    //               ':00',
    //             ],
    //           },
    //         },
    //       },
    //       arrivalDateTime: {
    //         $dateFromString: {
    //           dateString: {
    //             $concat: [
    //               {
    //                 $dateToString: {
    //                   date: '$sectors.arrivalDate',
    //                   format: '%Y-%m-%d',
    //                 },
    //               },
    //               'T',
    //               '$sectors.arrivalTime',
    //               ':00',
    //             ],
    //           },
    //         },
    //       },
    //     },
    //   },

    //   {
    //     $match:
    //       type === 'upcoming'
    //         ? { departureDateTime: { $gt: now } }
    //         : type === 'active'
    //           ? {
    //               departureDateTime: { $lte: now },
    //               arrivalDateTime: { $gte: now },
    //             }
    //           : { arrivalDateTime: { $lt: now } },
    //   },

    //   {
    //     $lookup: {
    //       from: 'crewdetails',
    //       localField: 'sectors.assignedCrews.crews',
    //       foreignField: '_id',
    //       as: 'crewInfo',
    //     },
    //   },

    //   {
    //     $addFields: {
    //       'sectors.assignedCrews': {
    //         $map: {
    //           input: '$sectors.assignedCrews',
    //           as: 'group',
    //           in: {
    //             designation: '$$group.designation',
    //             crews: {
    //               $filter: {
    //                 input: '$crewInfo',
    //                 as: 'ci',
    //                 cond: { $in: ['$$ci._id', '$$group.crews'] },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },

    //   {
    //     $project: {
    //       tripId: 1,
    //       quotation: 1,
    //       quotationNo: 1,
    //       sector: '$sectors',
    //       departureDateTime: 1,
    //       arrivalDateTime: 1,
    //       createdAt: 1,
    //       updatedAt: 1,
    //     },
    //   },

    //   // ✅ Pagination + Count in one go
    //   {
    //     $facet: {
    //       result: [sortStage, { $skip: offset }, { $limit: limit }],
    //       totalCount: [{ $count: 'count' }],
    //     },
    //   },

    //   {
    //     $project: {
    //       result: 1,
    //       totalCount: {
    //         $ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0],
    //       },
    //     },
    //   },
    // ];

    const pipeline: any[] = [
      { $match: { 'sectors.assignedCrews.crews': crewObjId } },
      { $unwind: '$sectors' },
      { $match: { 'sectors.assignedCrews.crews': crewObjId } },
      { $match: matchSearch },
      {
        $addFields: {
          departureDateTime: {
            $dateFromString: {
              dateString: {
                $concat: [
                  {
                    $dateToString: {
                      date: '$sectors.depatureDate',
                      format: '%Y-%m-%d',
                    },
                  },
                  'T',
                  '$sectors.depatureTime',
                  ':00',
                ],
              },
            },
          },
          arrivalDateTime: {
            $dateFromString: {
              dateString: {
                $concat: [
                  {
                    $dateToString: {
                      date: '$sectors.arrivalDate',
                      format: '%Y-%m-%d',
                    },
                  },
                  'T',
                  '$sectors.arrivalTime',
                  ':00',
                ],
              },
            },
          },
        },
      },

      {
        $match:
          type === 'upcoming'
            ? { departureDateTime: { $gt: now } }
            : type === 'active'
              ? {
                  departureDateTime: { $lte: now },
                  arrivalDateTime: { $gte: now },
                }
              : { arrivalDateTime: { $lt: now } },
      },

      // ✅ Populate assigned crew full details
      {
        $lookup: {
          from: 'crew-details', // ensure correct
          localField: 'sectors.assignedCrews.crews',
          foreignField: '_id',
          as: 'crewInfo',
        },
      },
      {
        $addFields: {
          'sectors.crewGroup': {
            $map: {
              input: '$sectors.assignedCrews',
              as: 'group',
              in: {
                designation: '$$group.designation',
                crews: {
                  $map: {
                    input: {
                      $filter: {
                        input: '$crewInfo',
                        as: 'ci',
                        cond: { $in: ['$$ci._id', '$$group.crews'] },
                      },
                    },
                    as: 'member',
                    in: {
                      id: { $toString: '$$member._id' },
                      fullName: '$$member.fullName',
                      displayName: '$$member.fullName',
                      designation: '$$member.designation',
                      phone: '$$member.phone',
                      email: '$$member.email',
                      profile: '$$member.profile',
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ✅ NEW: Lookup & hydrate quotation object
      {
        $lookup: {
          from: 'quotes', // confirm correct name
          localField: 'quotation',
          foreignField: '_id',
          as: 'quotationData',
        },
      },
      {
        $addFields: {
          quotation: {
            $let: {
              vars: { q: { $arrayElemAt: ['$quotationData', 0] } },
              in: {
                id: { $toString: '$$q._id' },
                category: '$$q.category',
                quotationNo: '$$q.quotationNo',
                aircraft: '$$q.aircraft', // or lookup aircraft later if needed
              },
            },
          },
        },
      },
      { $unset: 'quotationData' },

      {
        $project: {
          tripId: 1,
          quotation: 1, // Now hydrated object ✅
          quotationNo: 1,
          sector: '$sectors',
          departureDateTime: 1,
          arrivalDateTime: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },

      // ✅ Pagination + Count
      {
        $facet: {
          result: [sortStage, { $skip: offset || 0 }, { $limit: limit || 0 }],
          totalCount: [{ $count: 'count' }],
        },
      },
      {
        $project: {
          result: 1,
          totalCount: {
            $ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0],
          },
        },
      },
    ];

    const [data] = await this.Model.aggregate(pipeline);

    return data;
  }

  async uploadCrewTripDocument(args) {
    const { tripId, sectorNo } = args.where;

    const updatedTrip = await this.Model.findOneAndUpdate(
      {
        tripId,
      },
      {
        $push: {
          'sectors.$[sec].crewDocuments': {
            ...args.data,
            uploadedAt: new Date(),
          },
        },
      },
      {
        arrayFilters: [{ 'sec.sectorNo': sectorNo }],
        returnDocument: 'after', // <— return updated doc
        lean: true,
      },
    );

    if (!updatedTrip) {
      throw new Error(`Failed to upload document`);
    }

    return updatedTrip;
  }
}
