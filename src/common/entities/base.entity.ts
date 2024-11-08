import { Prop, Schema } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema()
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

  @Prop({ type: SchemaTypes.Date })
  deletedAt?: Date;

  @Prop()
  deletedBy?: string;

  // @Prop()
  // roles?: string[];
}
