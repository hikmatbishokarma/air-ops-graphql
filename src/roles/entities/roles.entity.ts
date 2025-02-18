import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Permissions, ResourceAction, RoleType } from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ _id: false, timestamps: false })
export class AccessPermission {
  @Prop()
  resource: string;
  @Prop({ type: [String], enum: ResourceAction })
  action: ResourceAction[];
}

@Schema({ collection: 'roles' })
export class RoleEntity extends BaseEntity {
  @Prop({ type: String, enum: RoleType })
  type: RoleType;
  @Prop()
  name!: string;
  @Prop()
  description: string;
  // @Prop({ type: [String], enum: Permissions })
  // permissions: Permissions[];

  // @Prop({
  //   type: [{ type: SchemaTypes.ObjectId, ref: 'ResourceEntity' }],
  //   required: false,
  // })
  // resources: [Types.ObjectId];
  @Prop({ type: [AccessPermission] })
  accessPermissions: AccessPermission[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleEntity);
