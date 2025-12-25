// notification/system.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationEntity } from '../entities/notification.entity';
import { Model } from 'mongoose';

import { NotificationGateway } from './notification.gateway';
import { ISystemNotification } from '../interfaces/notification.interface';
import { MongooseQueryService } from '@app/query-mongoose';

@Injectable()
export class SystemNotificationService extends MongooseQueryService<NotificationEntity> {
  constructor(
    @InjectModel(NotificationEntity.name)
    private readonly model: Model<NotificationEntity>,
    private readonly notificationGateway: NotificationGateway, // WebSocket
  ) {
    super(model);
  }

  async createSystemNotification(data: ISystemNotification) {
    const notification = await this.createOne(data);

    // Real-time emit to connected clients (e.g., admins)
    this.notificationGateway.broadcastNotification(notification);

    return notification;
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.model.findByIdAndUpdate(
      notificationId,
      { $addToSet: { isReadBy: userId } },
      { new: true },
    );
  }

  async getForUser(userId: string, roles: string[]) {
    return this.model
      .find({
        $or: [{ recipientIds: userId }, { recipientRoles: { $in: roles } }],
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
  }

  async systemNotifications(where, currentUser) {
    console.log('where:::', where);
    const result = await this.query({});

    return result;
  }

  async markNotificationsAsRead(input): Promise<any> {
    const { notificationIds, userId } = input;
    if (!notificationIds || notificationIds.length === 0 || !userId) {
      return {
        acknowledged: false,
        message: 'Invalid input for marking notifications as read.',
      };
    }

    try {
      const result = await this.model
        .updateMany(
          {
            _id: { $in: notificationIds },
          },
          {
            $addToSet: { isReadBy: userId },
          },
        )
        .exec();

      // Optional: If you want to broadcast that these notifications were read
      // (e.g., to update other admin's views if they are also looking at the same notification)
      // You would fetch the updated notifications and broadcast them.
      // This is more complex as it requires sending updates for existing notifications.
      // For now, the frontend's optimistic update is sufficient.

      if (result.modifiedCount) return true;
      else return false;
    } catch (error) {
      console.error(
        `[SystemNotificationService] Error marking notifications as read:`,
        error,
      );
      throw error; // Re-throw to be caught by the controller
    }
  }
}
