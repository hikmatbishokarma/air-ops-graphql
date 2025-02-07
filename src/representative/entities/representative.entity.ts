import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { ClientType } from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'representatives' })
export class RepresentativeEntity extends BaseEntity {
  @Prop()
  name: string;
  @Prop()
  phone: string;
  @Prop()
  email: string;
  @Prop()
  address: string;
  @Prop({ ref: 'ClientsEntity', type: SchemaTypes.ObjectId, required: true })
  client: Types.ObjectId;
  @Prop({ default: false })
  isCompany: boolean;
  @Prop({ default: false })
  isPerson: boolean;
}

export const RepresentativeSchema =
  SchemaFactory.createForClass(RepresentativeEntity);
