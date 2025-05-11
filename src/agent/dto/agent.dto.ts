import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { BillingCycle, SubscriptionPlan } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { UserDTO } from 'src/users/dto/users.dto';

// @ObjectType()
// @InputType('basicInfoInput')
// export class BasicInputDto {
//   @Field()
//   name: string;
//   @Field()
//   @IsEmail({}, { message: 'Email must be a valid email address' })
//   @IsNotEmpty({ message: 'Email is required' })
//   email: string;
//   @Field()
//   @IsPhoneNumber(null, { message: 'Phone must be a valid phone number' })
//   @IsNotEmpty({ message: 'Phone is required' })
//   phone: string;
//   @Field()
//   address: string;
//   @Field()
//   city: string;
//   @Field({ nullable: true })
//   state: string;
//   @Field()
//   country: string;
//   @Field({ nullable: true })
//   zipCode: string;
// }

// @ObjectType()
// @InputType('companyDetailsInput')
// export class CompanyDetailsInputDto {
//   @Field()
//   name: string;
//   @Field()
//   address: string;
//   @Field()
//   @IsEmail({}, { message: 'Email must be a valid email address' })
//   @IsNotEmpty({ message: 'Email is required' })
//   email: string;
//   @Field()
//   @IsPhoneNumber(null, { message: 'Phone must be a valid phone number' })
//   @IsNotEmpty({ message: 'Phone is required' })
//   phone: string;
//   @Field({ nullable: true })
//   branch: string;
// }

// @ObjectType()
// @InputType('brandingInput')
// export class BrandingInputdto {
//   @Field()
//   logoUrl: string;
//   @Field()
//   supportEmail: string;
//   @Field({ nullable: true })
//   ticketFooterNote: string;
//   @Field({ nullable: true })
//   websiteUrl: string;
//   @Field({ nullable: true })
//   themeColor?: string;
// }

@ObjectType('agent', { description: 'Agent' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
// @Relation('createdByUser', () => UserDTO, { disableRemove: true })
@InputType()
export class AgentDto extends BaseDTO {
  // @Field(() => BasicInputDto)
  // basic: BasicInputDto;
  //basic info
  @FilterableField()
  name: string;
  @FilterableField()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @FilterableField()
  @IsPhoneNumber(null, { message: 'Phone must be a valid phone number' })
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;
  @Field()
  address: string;
  @Field()
  city: string;
  @Field({ nullable: true })
  state: string;
  // @Field()
  // country: string;
  @Field({ nullable: true })
  pinCode: string;
  //company details
  // @Field(() => CompanyDetailsInputDto)
  // companyDetails: BasicInputDto;
  @FilterableField()
  companyName: string;
  // @Field()
  // companyAddress: string;
  // @FilterableField()
  // @IsEmail({}, { message: 'Email must be a valid email address' })
  // @IsNotEmpty({ message: 'Email is required' })
  // companyEmail: string;
  // @FilterableField()
  // @IsPhoneNumber(null, { message: 'Phone must be a valid phone number' })
  // @IsNotEmpty({ message: 'Phone is required' })
  // companyPhone: string;
  // @Field({ nullable: false })
  // branch: string;

  //branding
  // @Field(() => BrandingInputdto)
  // branding: BrandingInputdto;

  @Field()
  companyLogo: string;
  @FilterableField()
  supportEmail: string;
  @Field({ nullable: true })
  ticketFooterNote: string;
  @Field({ nullable: true })
  websiteUrl: string;
  @Field({ nullable: true })
  themeColor?: string;

  @FilterableField(() => SubscriptionPlan, { nullable: true })
  subscriptionPlan?: string;
  @FilterableField(() => BillingCycle, { nullable: true })
  billingCycle?: string;

  @Field(() => UserDTO, { nullable: true })
  createdByUser?: UserDTO; // ✅ Add this for relation
}
