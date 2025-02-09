import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ _id: false, timestamps: false })
export class PricesDto {
  @Prop()
  label: string;
  @Prop()
  unit: string;
  @Prop()
  price: number;
  @Prop()
  currency: string;
  @Prop()
  total: number;
  @Prop()
  margin: number;
}

@Schema({ collection: 'prices', timestamps: true })
export class PriceEntity extends BaseEntity {
  @Prop({ ref: 'AircraftsEntity', type: SchemaTypes.ObjectId, required: true })
  aircraft: Types.ObjectId;
  @Prop({ type: [PricesDto] })
  prices: PricesDto[];
  @Prop()
  grandTotal: number;
}

export const PriceSchema = SchemaFactory.createForClass(PriceEntity);
