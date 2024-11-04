import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'roles' })
export class RoleEntity extends BaseEntity {
  @Prop()
  name!: string;
  @Prop()
  description: string;
  @Prop()
  permission: [string];
  @Prop()
  resources: string;
}

export const RoleSchema = SchemaFactory.createForClass(RoleEntity);
