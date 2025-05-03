import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Gender, RoleType } from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';
import { RoleEntity } from 'src/roles/entities/roles.entity';

@Schema({ collection: 'users' })
export class UserEntity extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  pinCode: string;

  @Prop()
  image: string;

  @Prop()
  dob: string;

  @Prop({ type: String, enum: Gender })
  gender: Gender;

  @Prop({ type: Types.ObjectId, ref: 'RoleEntity', required: true })
  role: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AgentEntity', required: true })
  agentId: Types.ObjectId;
}
export const UserSchema = SchemaFactory.createForClass(UserEntity);
