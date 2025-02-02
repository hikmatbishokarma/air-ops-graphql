import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ClientType } from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'clients' })
export class ClientsEntity extends BaseEntity {
  @Prop()
  name: string;
  @Prop()
  phone: string;
  @Prop()
  email: string;
  @Prop()
  address: string;
  //   @Prop({ type: String, enum: ClientType })
  //   type: ClientType;
  @Prop({ default: false })
  isCompany: boolean;
  @Prop({ default: false })
  isPerson: boolean;
}

export const ClientsSchema = SchemaFactory.createForClass(ClientsEntity);
