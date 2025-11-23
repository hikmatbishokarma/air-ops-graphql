import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { LeaveStatus, LeaveType } from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'leaves', timestamps: true })
export class LeaveEntity extends BaseEntity {
  @Prop({ type: String, enum: LeaveType, required: true })
  type: LeaveType;
  @Prop({ type: Date, required: true })
  fromDate: Date;
  @Prop({ type: Date, required: true })
  toDate: Date;
  @Prop()
  reason: string;
  @Prop()
  attachment: string;
  @Prop({ type: String, enum: LeaveStatus })
  status: LeaveStatus;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'CrewDetailEntity',
    default: undefined,
  })
  crew: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'OperatorEntity',
    default: undefined,
  })
  operatorId: Types.ObjectId;

  @Prop()
  remark: string;
}

export const LeaveSchema = SchemaFactory.createForClass(LeaveEntity);



LeaveSchema.virtual('operator', {
  ref: 'OperatorEntity',
  localField: 'operatorId',
  foreignField: '_id',
  justOne: true,
});
