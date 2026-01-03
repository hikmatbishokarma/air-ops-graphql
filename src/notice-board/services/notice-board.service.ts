import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NoticeBoardEntity } from '../entities/notice-board.entity';
import { CreateNoticeBoardInput } from '../inputs/create-notice-board.input';
import { CrewDetailDto } from 'src/crew-details/dto/crew-detail.dto';
import { MongooseQueryService } from '@app/query-mongoose';


@Injectable()
export class NoticeBoardService extends MongooseQueryService<NoticeBoardEntity> {
    constructor(
        @InjectModel(NoticeBoardEntity.name)
        private model: Model<NoticeBoardEntity>,
    ) {
        super(model)
    }

    async create(createNoticeBoardInput: CreateNoticeBoardInput, user: CrewDetailDto): Promise<NoticeBoardEntity> {
        const createdBy = user?.id || user['_id'];
        // const newNotice = new this.model({
        //     ...createNoticeBoardInput,
        //     createdBy,
        // });
        const newNotice = await this.createOne({
            ...createNoticeBoardInput,
            createdBy,
        });
        return newNotice;
    }

    async getActiveNotice(): Promise<NoticeBoardEntity | null> {
        const now = new Date();
        // Find notices that are active and current date is within range
        // Sort by createdAt desc to get the latest one if multiple overlap
        const notice = await this.model
            .findOne({
                isActive: true,
                startDate: { $lte: now },
                endDate: { $gte: now },
            })
            .sort({ createdAt: -1 })
            .populate('createdBy');

        return notice;
    }
}
