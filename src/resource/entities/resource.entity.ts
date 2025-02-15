import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'resources', timestamps: true })
export class ResourceEntity extends BaseEntity {
  @Prop()
  menu: string;
  @Prop()
  segment: string;
  @Prop()
  title: string;
  @Prop()
  icon: string;
}

export const ResourceSchema = SchemaFactory.createForClass(ResourceEntity);
