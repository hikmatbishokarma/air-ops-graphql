import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'libraries', timestamps: true })
export class LibraryEntity extends BaseEntity {
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

export const LibrarySchema = SchemaFactory.createForClass(LibraryEntity);
