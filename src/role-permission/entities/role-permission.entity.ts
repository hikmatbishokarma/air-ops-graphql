import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

import { BaseEntity } from 'src/common/entities/base.entity';
import { Permission } from 'src/role-permission/interfaces/permission.interface';

@Schema({ collection: 'role-permissions', timestamps: true })
export class RolePermissionEntity extends BaseEntity {
  @Prop({ ref: 'RoleEntity', type: SchemaTypes.ObjectId, required: true })
  role: Types.ObjectId;
  @Prop({ type: [Object] })
  permissions: Permission[];
}

export const RolePermissionSchema =
  SchemaFactory.createForClass(RolePermissionEntity);
