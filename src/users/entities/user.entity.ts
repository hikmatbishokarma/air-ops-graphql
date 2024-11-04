import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Address } from 'src/interfaces/user-address.interface';

@Schema({ collection: 'users' })
export class UserEntity extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  mobile: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [Object] })
  address: Address[]; // Using the Address interface here

  // @Prop({ type: Types.ObjectId, ref: 'RoleEntity' })
  // role: RoleEntity | Types.ObjectId;  // Reference to the Role entity
}
export const UserSchema = SchemaFactory.createForClass(UserEntity);
