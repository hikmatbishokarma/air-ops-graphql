import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Gender, RoleType, UserType } from 'src/app-constants/enums';
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

  // @Prop({ type: SchemaTypes.ObjectId, ref: 'RoleEntity', required: true })
  // role: Types.ObjectId;

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'RoleEntity', required: true }])
  roles: Types.ObjectId[];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'OperatorEntity',
    default: undefined,
  })
  operatorId: Types.ObjectId;

  @Prop({ type: String, enum: UserType, default: UserType.PLATFORM_USER })
  type: UserType;
}
export const UserSchema = SchemaFactory.createForClass(UserEntity);
