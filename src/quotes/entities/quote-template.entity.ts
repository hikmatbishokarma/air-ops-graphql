import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TemplateType } from 'src/app-constants/enums';

@Schema({ collection: 'quotation-templates' })
export class QuotationTemplateEntity extends Document {
  @Prop()
  quotationId: Types.ObjectId;
  @Prop()
  quotationNo: string;
  @Prop({ type: String, enum: TemplateType })
  type: string;
  @Prop()
  template: string;
}

export const QuotationTemplateSchema = SchemaFactory.createForClass(
  QuotationTemplateEntity,
);
