import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

export class BasicEntity {
  @Prop()
  name: string;
  @Prop({ unique: true })
  email: string;
  @Prop({ unique: true })
  phone: string;
  @Prop()
  address: string;
  @Prop()
  city: string;
  @Prop()
  state: string;
  @Prop()
  country: string;
  @Prop()
  zipCode: string;
}

const BasicSchema = SchemaFactory.createForClass(BasicEntity);

export class CompanyDetailsEntity {
  @Prop()
  name: string;
  @Prop()
  address: string;
  @Prop({ unique: true })
  email: string;
  @Prop({ unique: true })
  phone: string;
  @Prop()
  branch: string;
}

const CompanyDetailsSchema = SchemaFactory.createForClass(CompanyDetailsEntity);

export class BrandingEntity {
  @Prop()
  logoUrl: string;
  @Prop()
  supportEmail: string;
  @Prop()
  ticketFooterNote: string;
  @Prop()
  websiteUrl: string;
  @Prop()
  themeColor?: string;
}

const BrandingSchema = SchemaFactory.createForClass(BrandingEntity);

@Schema({ collection: 'agents', timestamps: true })
export class AgentEntity extends BaseEntity {
  @Prop({ type: BasicEntity, required: true })
  basic: BasicEntity;
  @Prop({ type: CompanyDetailsEntity, required: true })
  companyDetails: CompanyDetailsEntity;
  @Prop({ type: BrandingEntity, required: true })
  branding: BrandingEntity;
  @Prop()
  subscriptionPlan?: string;
  @Prop()
  billingCycle?: string;
}

export const AgentSchema = SchemaFactory.createForClass(AgentEntity);
