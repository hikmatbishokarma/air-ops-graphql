import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';
import { auditPlugin } from 'src/common/plugins/audit.plugin';

@Schema({ collection: 'manuals', timestamps: true })
export class ManualEntity extends BaseEntity {
  @Prop()
  name: string;
  @Prop()
  department: string;
  @Prop()
  attachment: string;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'OperatorEntity',
    default: undefined,
  })
  operatorId: Types.ObjectId;
}

export const ManualSchema = SchemaFactory.createForClass(ManualEntity);
