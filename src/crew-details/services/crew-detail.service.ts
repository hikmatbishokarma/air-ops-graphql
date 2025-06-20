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

  async staffCertificates(validTillBefore, search) {
    const matchStage = {};

    if (validTillBefore) {
      matchStage['certifications.validTillDate'] = { $lte: validTillBefore };
    }

    if (search) {
      matchStage['$expr'] = {
        $regexMatch: {
          input: {
            $concat: ['$firstName', ' ', '$middleName', ' ', '$lastName'],
          },
          regex: search,
          options: 'i',
        },
      };
    }

    const result = await this.Model.aggregate([
      { $unwind: '$certifications' },
      // Only include $match if any filters are present
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $project: {
          id: '$certifications._id',
          crewName: {
            $concat: ['$firstName', ' ', '$middleName', ' ', '$lastName'],
          },
          certificationName: '$certifications.certification',
          validTillDate: '$certifications.validTill',
          uploadCertificate: '$certifications.uploadCertificate',
        },
      },
      { $sort: { validTillDate: 1 } },
    ]);
  }
}
