import { SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NotamCategory, RegionCode } from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';



@Schema({ collection: 'notams', timestamps: true })
export class NotamEntity extends BaseEntity {


    // @Prop({ type: 'enum', enum: NotamCategory })
    @Prop({ type: String, enum: NotamCategory })
    category: NotamCategory;

    @Prop({ type: String, enum: RegionCode })
    region: RegionCode;

    @Prop()
    fileName: string;

    // @Prop()
    // fileUrl: string;

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: 'OperatorEntity',
        default: undefined,
    })
    operatorId: Types.ObjectId;

}


export const NotamSchema = SchemaFactory.createForClass(NotamEntity);

NotamSchema.virtual('operator', {
    ref: 'OperatorEntity',
    localField: 'operatorId',
    foreignField: '_id',
    justOne: true,
});
