// notification/system.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationEntity } from '../entities/notification.entity';
import { Model } from 'mongoose';
import { CreateSystemNotificationDto } from '../dto/system.dto';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class SystemNotificationService {
  constructor(
    @InjectModel(NotificationEntity.name)
    private readonly notificationModel: Model<NotificationEntity>,
    private readonly notificationGateway: NotificationGateway, // WebSocket
  ) {}

  async createSystemNotification(dto: CreateSystemNotificationDto) {
    const notification = await this.notificationModel.create({
      ...dto,
      type: dto.type,
      refType: dto.refType,
      refId: dto.refId,
      message: dto.message,
      title: dto.title || null,
      metadata: dto.metadata || {},
      recipientRoles: dto.recipientRoles || [],
      recipientIds: dto.recipientIds || [],
      isReadBy: [],
      createdAt: new Date(),
    });

    // Real-time emit to connected clients (e.g., admins)
    this.notificationGateway.broadcastNotification(notification);

    return notification;
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { $addToSet: { isReadBy: userId } },
      { new: true },
    );
  }

  async getForUser(userId: string, roles: string[]) {
    return this.notificationModel
      .find({
        $or: [{ recipientIds: userId }, { recipientRoles: { $in: roles } }],
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
  }
}
