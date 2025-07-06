import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { ClientType } from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'clients' })
export class ClientsEntity extends BaseEntity {
  @Prop({ required: true })
  name: string;
  @Prop()
  lastName: string;
  @Prop({ required: true, unique: true })
  phone: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop()
  address: string;
  //   @Prop({ type: String, enum: ClientType })
  //   type: ClientType;
  @Prop({ default: false })
  isCompany: boolean;
  @Prop({ default: false })
  isPerson: boolean;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'OperatorEntity',
    default: undefined,
  })
  operatorId: Types.ObjectId;
  @Prop()
  panNo: string;
  @Prop()
  gstNo: string;
  @Prop()
  billingAddress: string;
}

export const ClientsSchema = SchemaFactory.createForClass(ClientsEntity);
