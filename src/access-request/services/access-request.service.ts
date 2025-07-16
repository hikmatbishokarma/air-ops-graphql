import { MongooseQueryService } from '@app/query-mongoose';
import { Injectable } from '@nestjs/common';
import { AccessRequestEntity } from '../entities/access-request.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SystemNotificationService } from 'src/notification/services/system.service';

@Injectable()
export class AccessRequestService extends MongooseQueryService<AccessRequestEntity> {
  constructor(
    @InjectModel(AccessRequestEntity.name)
    model: Model<AccessRequestEntity>,
    private readonly systemNotificationService: SystemNotificationService,
  ) {
    super(model);
  }

  async requestManualAccess(docId: string, user: any) {
    // 1. Create Access Request
    const accessRequest = await this.createOne({
      docType: 'MANUAL',
      docId,
      requestedBy: user._id,
      reason: 'Need to review the manual for ops planning.',
    });

    // 2. Create Linked Notification
    await this.systemNotificationService.createSystemNotification({
      type: 'ACCESS_REQUEST',
      refType: 'ACCESS_REQUEST',
      refId: accessRequest.id,
      message: `${user.name} requested access to Manual`,
      recipientRoles: ['ADMIN'],
      metadata: {
        //   docTitle: await this.getManualTitle(docId), // Optional
        docType: 'MANUAL',
        requestedByName: user.name,
      },
    });

    return accessRequest;
  }
}
