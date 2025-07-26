import { MongooseQueryService } from '@app/query-mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AccessRequestEntity } from '../entities/access-request.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SystemNotificationService } from 'src/notification/services/system.service';
import { ManualService } from 'src/manual/services/manual.service';

@Injectable()
export class AccessRequestService extends MongooseQueryService<AccessRequestEntity> {
  constructor(
    @InjectModel(AccessRequestEntity.name)
    model: Model<AccessRequestEntity>,
    private readonly systemNotificationService: SystemNotificationService,
    private readonly manualService: ManualService,
  ) {
    super(model);
  }

  async requestManualAccess(docId: string, user: any) {
    const manual = await this.manualService.findById(docId);
    if (!manual) throw new BadRequestException('Invalid Doc ID');
    // 1. Create Access Request
    const accessRequest = await this.createOne({
      docType: 'MANUAL',
      docId,
      requestedBy: user?.id || user?.sub,
      reason: 'Need to review the manual for ops planning.',
    });

    if (!accessRequest)
      throw new InternalServerErrorException('Failed to create request');

    // 2. Create Linked Notification
    await this.systemNotificationService.createSystemNotification({
      type: 'ACCESS_REQUEST',
      refType: 'ACCESS_REQUEST',
      refId: accessRequest.id,
      message: `${user.name} requested access to Manual`,
      recipientRoles: ['ADMIN', 'SUPER_ADMIN'],
      metadata: {
        docType: 'MANUAL',
        requestedByName: user?.name,
        userAvatar: user?.profile,
        docName: manual.name,
        docCategory: manual.department,
        docAttachment: manual.attachment,
        accessRequestStatus: accessRequest.status,
      },
    });

    return accessRequest;
  }

  async updateAccessRequestStatus(status, notificationId: string, user: any) {
    const notification =
      await this.systemNotificationService.findById(notificationId);
    if (!notification)
      throw new NotFoundException(
        `Notification ID "${notificationId}" not found.`,
      );

    notification.metadata['accessRequestStatus'] = status;
    await notification.save();

    const accessRequest = await this.findById(notification.refId.toString());

    if (!accessRequest) {
      throw new NotFoundException(
        `Access Request with ID "${accessRequest.id}" not found.`,
      );
    }

    if (accessRequest.status !== 'PENDING') {
      throw new Error(`Access Request is already ${accessRequest.status}.`);
    }

    accessRequest.status = status;
    await accessRequest.save();

    // --- 1. Create and Broadcast Status Update Notification to the Requester ---
    await this.systemNotificationService.createSystemNotification({
      type: 'ACCESS_REQUEST_STATUS_UPDATE',
      refType: 'ACCESS_REQUEST',
      refId: accessRequest.id,
      message: `Your access request for ${accessRequest.docType} was ${status.toLowerCase()}.`,
      recipientIds: [accessRequest?.requestedBy?.toString()],
      metadata: {
        docType: 'MANUAL',
        acceptedBy: user?.name,
        userAvatar: user?.profile,
        docName: notification?.metadata['docName'],
        docCategory: notification?.metadata['docCategory'],
        docAttachment: notification?.metadata['docAttachment'],
        accessRequestStatus: status,
      },
    });

    return accessRequest;
  }
}
