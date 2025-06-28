import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { MongooseQueryService } from '@app/query-mongoose';
import { LeaveEntity } from '../entities/leave.entity';
import { LeaveStatus } from 'src/app-constants/enums';

export class LeaveService extends MongooseQueryService<LeaveEntity> {
  constructor(
    @InjectModel(LeaveEntity.name)
    private readonly model: Model<LeaveEntity>,
  ) {
    super(model);
  }

  async updateLeaveRequest(args) {
    const { id } = args.where;
    const { status, remark } = args.data;

    const leave = await this.findById(id);
    if (!leave) throw new Error('Leave Request Not Found');

    if (
      leave?.status == LeaveStatus.CANCELLED ||
      leave.status == LeaveStatus.APPROVED ||
      leave.status == LeaveStatus.DECLINED
    ) {
      throw new Error('Leave Request Already Acknowledge ');
    }

    const update = await this.updateOne(id, { status, remark });
    if (!update) throw new Error('Failed to update leave request');

    return update;
  }
}
