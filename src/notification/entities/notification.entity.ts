import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'notifications' })
export class NotificationEntity extends BaseEntity {
  @Prop()
  type: string;
  @Prop()
  refType: string;
  @Prop()
  refId: Types.ObjectId;
  @Prop()
  message: string;
  @Prop()
  title?: string;
  @Prop()
  recipientRoles?: string[];
  @Prop()
  recipientIds?: Types.ObjectId[];
  @Prop()
  isReadBy: Types.ObjectId[];
  @Prop()
  metadata?: object;
}

export const NotificationSchema =
  SchemaFactory.createForClass(NotificationEntity);
