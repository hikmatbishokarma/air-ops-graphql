import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleType } from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'roles' })
export class RoleEntity extends BaseEntity {
  @Prop({ type: String, enum: RoleType })
  roleType: RoleType;
  @Prop()
  name!: string;
  @Prop()
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(RoleEntity);
RoleSchema.index({ roleType: 1, roleName: 1 }, { unique: true });

RoleSchema.virtual('rolePermissions', {
  ref: 'RolePermissionEntity',
  localField: '_id',
  foreignField: 'role',
});
