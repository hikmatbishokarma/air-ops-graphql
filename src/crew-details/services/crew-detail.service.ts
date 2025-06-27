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

  async staffCertificates(args) {
    const { validTillBefore, search, operatorId } = args || {};
    const matchStage = {
      ...(operatorId && { operatorId: { eq: operatorId } }),
    };

    if (validTillBefore) {
      matchStage['certifications.validTill'] = { $lte: validTillBefore };
    }

    if (search) {
      matchStage['$expr'] = {
        $regexMatch: {
          input: {
            $concat: ['$fullName', '$displayName'],
          },
          regex: search,
          options: 'i',
        },
      };
    }

    // const result = await this.Model.aggregate([
    //   { $unwind: '$certifications' },
    //   // Only include $match if any filters are present
    //   ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    //   {
    //     $project: {
    //       _id: 0,
    //       id: '$certifications._id',
    //       staffName: '$fullName',
    //       displayName: '$displayName',
    //       validTill: '$certifications.validTill',
    //       name: '$certifications.name',
    //       licenceNo: '$certifications.licenceNo',
    //       dateOfIssue: '$certifications.dateOfIssue',
    //       issuedBy: '$certifications.issuedBy',
    //     },
    //   },
    //   { $sort: { validTill: 1 } },
    // ]);

    const [{ data, totalCount }] = await this.Model.aggregate([
      { $unwind: '$certifications' },
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $facet: {
          data: [
            {
              $project: {
                _id: 0,
                id: '$certifications._id',
                staffName: '$fullName',
                displayName: '$displayName',
                validTill: '$certifications.validTill',
                name: '$certifications.name',
                licenceNo: '$certifications.licenceNo',
                dateOfIssue: '$certifications.dateOfIssue',
                issuedBy: '$certifications.issuedBy',
              },
            },
            { $sort: { validTill: 1 } },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);

    return {
      data,
      totalCount: totalCount[0]?.count || 0,
    };
  }
}
