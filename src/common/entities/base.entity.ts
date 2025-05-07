import { Prop, Schema } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema()
export abstract class BaseEntity extends Document {
  @Prop({ default: false })
  isActive?: boolean;
  @Prop({ default: () => new Date(), type: SchemaTypes.Date })
  createdAt?: string;

  @Prop({
    ref: 'UserEntity',
    type: SchemaTypes.ObjectId,
    required: false,
  })
  createdBy?: Types.ObjectId;

  @Prop({ default: () => new Date(), type: SchemaTypes.Date })
  updatedAt?: Date;

  @Prop({
    ref: 'UserEntity',
    type: SchemaTypes.ObjectId,
    required: false,
  })
  updatedBy?: Types.ObjectId;

  @Prop({ type: SchemaTypes.Date })
  deletedAt?: Date;

  @Prop()
  deletedBy?: string;

  // @Prop()
  // roles?: string[];
}
