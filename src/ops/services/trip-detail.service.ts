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
import { PassengerManifestTemplate } from 'src/notification/templates/passenger-manifest';
import { ConfigService } from '@nestjs/config';
import { PassengerDetailService } from 'src/passenger-detail/services/passenger-detail.service';

@Injectable()
export class TripDetailService extends MongooseQueryService<TripDetailEntity> {
  private airOpsLogo: string;
  private cloudFrontUrl: string;
  constructor(
    @InjectModel(TripDetailEntity.name)
    private readonly model: Model<TripDetailEntity>,
    private readonly quotesService: QuotesService,
    private readonly config: ConfigService,
    private readonly passengerDetailService: PassengerDetailService,
  ) {

    super(model);
    this.airOpsLogo = this.config.get<string>('logo');
    this.cloudFrontUrl = this.config.get<string>('s3.aws_cloudfront_base_url');
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
      { tripId, 'sectors.sectorNo': sectorNo },
      {
        $push: {
          'sectors.$.tripDocByCrew': {
            ...args.data,
            uploadedAt: new Date(),
          },
        },
      },
      {
        new: true, // return updated document
        lean: true, // return plain object
        // ❗ no upsert — so NO new trip is created
      },
    );

    if (!updatedTrip) {
      throw new Error(`Failed to upload document`);
    }

    return { ...updatedTrip, id: updatedTrip._id };
  }

  async generatePassengerManifest(args: {
    tripId: string;
    sectorNo: number;
  }): Promise<string> {
    const { tripId, sectorNo } = args;



    // Optimized aggregation: filter sector first, then lookup only relevant crew
    const [tripData] = await this.Model.aggregate([
      { $match: { tripId } },
      // Filter to get only the specific sector
      {
        $addFields: {
          sector: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$sectors',
                  as: 'sec',
                  cond: { $eq: ['$$sec.sectorNo', sectorNo] },
                },
              },
              0,
            ],
          },
        },
      },
      // Lookup quotation - only needed fields
      {
        $lookup: {
          from: 'quotes',
          localField: 'quotation',
          foreignField: '_id',
          as: 'quotationData',
          pipeline: [
            {
              $project: {
                aircraft: 1,
                operatorId: 1,
                quotationNo: 1,
                passengerInfo: 1,
              },
            },
          ],
        },
      },
      { $unwind: { path: '$quotationData', preserveNullAndEmptyArrays: true } },
      // Lookup aircraft - only needed fields
      {
        $lookup: {
          from: 'aircrafts',
          localField: 'quotationData.aircraft',
          foreignField: '_id',
          as: 'aircraftData',
          pipeline: [
            {
              $project: {
                code: 1,
                name: 1,
              },
            },
          ],
        },
      },
      { $unwind: { path: '$aircraftData', preserveNullAndEmptyArrays: true } },
      // Lookup operator - only needed fields
      {
        $lookup: {
          from: 'operators',
          localField: 'quotationData.operatorId',
          foreignField: '_id',
          as: 'operatorData',
          pipeline: [
            {
              $project: {
                companyName: 1,
                companyLogo: 1,
                address: 1,
              },
            },
          ],
        },
      },
      { $unwind: { path: '$operatorData', preserveNullAndEmptyArrays: true } },
      // Lookup only crew members assigned to THIS sector - only needed fields
      {
        $lookup: {
          from: 'crew-details',
          localField: 'sector.assignedCrews.crews',
          foreignField: '_id',
          as: 'crewData',
          pipeline: [
            {
              $project: {
                fullName: 1,
                displayName: 1,
                weight: 1,
                nationality: 1,
              },
            },
          ],
        },
      },
      // Project only needed fields from trip
      {
        $project: {
          tripId: 1,
          quotationNo: 1,
          sector: 1,
          quotationData: 1,
          aircraftData: 1,
          operatorData: 1,
          crewData: 1,
        },
      },
    ]);

    if (!tripData) throw new BadRequestException('Trip not found');
    if (!tripData.sector) throw new BadRequestException('Sector not found');

    const sector = tripData.sector;

    // Get passengers from quotation for this specific sector
    const sectorPassengers = tripData.quotationData?.passengerInfo?.sectors?.find(
      (s) => s.sectorNo === sectorNo,
    );
    const passengerList = sectorPassengers?.passengers || [];

    // Map crew data
    const crewList =
      sector.assignedCrews?.flatMap((group) => {
        return (
          group.crews?.map((crewId) => {
            const crewMember = tripData.crewData?.find(
              (c) => c._id.toString() === crewId.toString(),
            );
            return {
              name: crewMember?.fullName || crewMember?.displayName || 'N/A',
              designation: group.designation || 'N/A',
              weight: crewMember?.weight || '-',
              baggage: '-',
              nationality: crewMember?.nationality || 'INDIAN',
            };
          }) || []
        );
      }) || [];

    // Prepare data for template
    const manifestData = {
      operator: tripData.operatorData || {},
      aircraft: {
        registration: tripData.aircraftData?.code || 'N/A',
        type: tripData.aircraftData?.name || 'N/A',
      },
      flightNo: tripData.quotationNo || tripData.tripId || 'N/A',
      dateOfFlight: sector.depatureDate,
      departureTime: sector.depatureTime || 'N/A',
      departureStation: sector.source?.name || sector.source?.code || 'N/A',
      destinationStation:
        sector.destination?.name || sector.destination?.code || 'N/A',
      crew: crewList,
      passengers: passengerList.map((pax) => ({
        name: pax.name,
        gender: pax.gender,
        weight: {
          pax: pax.weight || '-',
          bag: '-',
        },
        checkedBaggage: 'NIL',
        nationality: pax.nationality || 'INDIAN',
      })),
      logoUrl: tripData.operatorData?.companyLogo ? `${this.cloudFrontUrl}${tripData.operatorData?.companyLogo}` : this.airOpsLogo,
    };


    const htmlContent = PassengerManifestTemplate(manifestData);

    return htmlContent;
  }

  async getTripChecklist(tripId: string) {
    const trip = await this.model.findById(tripId).lean();
    if (!trip) throw new Error('Trip not found');

    const checklistData = [];

    // Optimize: Fetch passenger details once if quotationNo is available
    let passengerDetail = null;
    if (trip.quotationNo) {
      passengerDetail = await this.passengerDetailService.Model.findOne({
        quotationNo: trip.quotationNo,
      }).lean();
    }

    for (const sector of trip.sectors) {
      const sectorNo = sector.sectorNo;
      const checklist = [];

      // 1. Timelines
      const hasTimelines = !!(
        sector.depatureDate &&
        sector.depatureTime &&
        sector.arrivalDate &&
        sector.arrivalTime
      );
      checklist.push({ name: 'Timelines', status: hasTimelines });

      // Find corresponding sector in PassengerDetail
      const paxSector = passengerDetail?.sectors?.find(
        (s) => s.sectorNo === sectorNo,
      );

      // 2. Pax
      const hasPax = paxSector?.passengers?.length > 0;
      checklist.push({ name: 'Pax', status: hasPax });

      // 3. Catering (Meals in Pax Detail)
      const hasCatering = paxSector?.meals?.length > 0;
      checklist.push({ name: 'Catering', status: hasCatering });

      // 4. Travels (Travel in Pax Detail)
      const hasTravels = !!paxSector?.travel;
      checklist.push({ name: 'Travels', status: hasTravels });

      // 5. Boarding Pass (Hardcoded False for now)
      checklist.push({ name: 'Boarding Pass', status: false });

      // 6. Ground Handler (Hardcoded False for now)
      checklist.push({ name: 'Ground Handler', status: false });

      // 7. Intimation Letters (Hardcoded False for now)
      const intimationLetters = [
        'Intimation Letter to APD',
        'Intimation Letter to ATC',
        'Intimation Letter to Terminal',
        'Intimation Letter to Re Fuel',
        'Intimation Letter to CISF',
        'Intimation Letter to Airport Operator',
        'Intimation Letter to Ground Handler',
      ];
      intimationLetters.forEach((letter) => {
        checklist.push({ name: letter, status: false });
      });

      // 8. CREW
      const hasCrew = sector.assignedCrews?.length > 0;
      checklist.push({ name: 'CREW', status: hasCrew });

      // 9. BA Reports (In Trip Detail Sector)
      const hasBaReports = sector.baInfo?.baReports?.length > 0;
      checklist.push({ name: 'BA Reports', status: hasBaReports });

      // 10. FUEL Reports (In Trip Detail Sector)
      const hasFuelReports = !!sector.fuelRecord;
      checklist.push({ name: 'FUEL Reports', status: hasFuelReports });

      // 11. Documents
      const documentTypes = [
        'Flight Plan',
        'Weight & Balance (CG)',
        'Tripkit',
        'Manifest',
        'Weather Briefing',
        'NOTAMS',
        'Helipad Permission',
        'DGCA Permission',
      ];

      documentTypes.forEach((docType) => {
        const hasDoc = sector.documents?.some((d) => d.type === docType);
        checklist.push({ name: docType, status: hasDoc });
      });

      checklistData.push({
        sectorNo: sectorNo,
        source: {
          name: sector.source?.name,
          code: sector.source?.code,
          city: sector.source?.city,
        },
        destination: {
          name: sector.destination?.name,
          code: sector.destination?.code,
          city: sector.destination?.city,
        },
        checklist: checklist,
      });
    }

    return { sectors: checklistData };
  }
}
