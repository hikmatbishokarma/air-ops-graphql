import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
} from '@app/query-graphql';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { BillingCycle, SubscriptionPlan } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType()
@InputType('basicInfoInput')
export class BasicInputDto {
  @Field()
  name: string;
  @Field()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @Field()
  @IsPhoneNumber(null, { message: 'Phone must be a valid phone number' })
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;
  @Field()
  address: string;
  @Field()
  city: string;
  @Field({ nullable: true })
  state: string;
  @Field()
  country: string;
  @Field({ nullable: true })
  zipCode: string;
}

@ObjectType()
@InputType('companyDetailsInput')
export class CompanyDetailsInputDto {
  @Field()
  name: string;
  @Field()
  address: string;
  @Field()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @Field()
  @IsPhoneNumber(null, { message: 'Phone must be a valid phone number' })
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;
  @Field({ nullable: true })
  branch: string;
}

@ObjectType()
@InputType('brandingInput')
export class BrandingInputdto {
  @Field()
  logoUrl: string;
  @Field()
  supportEmail: string;
  @Field({ nullable: true })
  ticketFooterNote: string;
  @Field({ nullable: true })
  websiteUrl: string;
  @Field({ nullable: true })
  themeColor?: string;
}

@ObjectType('agent', { description: 'Agent' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@InputType()
export class AgentDto extends BaseDTO {
  @Field(() => BasicInputDto)
  basic: BasicInputDto;
  @Field(() => CompanyDetailsInputDto)
  companyDetails: BasicInputDto;
  @Field(() => BrandingInputdto)
  branding: BrandingInputdto;
  @FilterableField(() => SubscriptionPlan, { nullable: true })
  subscriptionPlan?: string;
  @FilterableField(() => BillingCycle, { nullable: true })
  billingCycle?: string;
}
