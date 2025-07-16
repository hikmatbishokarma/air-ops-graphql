import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ timestamps: true, collection: 'access-requests' })
export class AccessRequestEntity extends BaseEntity {
  @Prop({ required: true, enum: ['MANUAL', 'LIBRARY'] })
  docType: string;

  @Prop({ required: true })
  docId: Types.ObjectId;

  @Prop({ required: true })
  requestedBy: Types.ObjectId;

  @Prop({ default: 'PENDING', enum: ['PENDING', 'APPROVED', 'DECLINED'] })
  status: string;

  @Prop()
  reviewedBy?: Types.ObjectId;

  @Prop()
  reviewedAt?: Date;

  @Prop()
  reason?: string;
}

export const AccessRequestSchema =
  SchemaFactory.createForClass(AccessRequestEntity);
