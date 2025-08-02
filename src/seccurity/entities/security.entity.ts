import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { SecurityDocType } from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'securities', timestamps: true })
export class SecurityEntity extends BaseEntity {
  @Prop({ type: String, enum: SecurityDocType })
  type: SecurityDocType;
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

export const SecuritySchema = SchemaFactory.createForClass(SecurityEntity);
