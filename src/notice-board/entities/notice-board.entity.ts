import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ collection: 'notice-boards', timestamps: true })
export class NoticeBoardEntity extends BaseEntity {
    @Prop({ required: true })
    message: string;

    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date;
}

export const NoticeBoardSchema = SchemaFactory.createForClass(NoticeBoardEntity);
