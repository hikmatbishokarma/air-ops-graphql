import { Prop } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export abstract class BaseEntity extends Document {
  @Prop({ default: false })
  status: boolean;
  @Prop({ default: () => new Date(), type: SchemaTypes.Date })
  createdAt?: string;

  @Prop()
  createdBy?: string;

  @Prop({ default: () => new Date(), type: SchemaTypes.Date })
  updatedAt?: Date;

  @Prop()
  updatedBy?: string;

  @Prop({ default: () => new Date(), type: SchemaTypes.Date })
  deletedAt?: Date;

  @Prop()
  deletedBy?: string;

  @Prop()
  roles?: string[];
}
