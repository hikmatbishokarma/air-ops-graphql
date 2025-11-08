import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
  UnPagedRelation,
} from '@app/query-graphql';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { CrewType, Gender, UserType } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { OperatorDto } from 'src/operator/dto/operator.dto';
import { RoleDTO } from 'src/roles/dto/roles.dto';

@ObjectType()
@InputType('nomineeInput')
export class NomineeDto {
  @Field({ nullable: true })
  fullName: string;
  @Field(() => Gender, { nullable: true })
  gender: Gender;
  @Field({ nullable: true })
  relation: string;
  @Field({ nullable: true })
  idProof: string;
  @Field({ nullable: true })
  mobileNumber: string;
  @Field({ nullable: true })
  alternateContact: string;
  @Field({ nullable: true })
  address: string;
  @Field({ nullable: true })
  insurance: string;
}

@ObjectType()
@InputType('certificationInput')
export class CertificationDto {
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  licenceNo: string;
  @Field({ nullable: true })
  dateOfIssue: Date;
  @Field({ nullable: true })
  issuedBy: string;
  @Field({ nullable: true })
  validTill: Date;
}

@ObjectType()
@InputType('BankDetailInput')
export class BankDetailDto {
  @Field({ nullable: true })
  accountPayee: string;

  @Field({ nullable: true })
  bankName: string;

  @Field({ nullable: true })
  accountNumber: string;

  @Field({ nullable: true })
  branch: string;

  @Field({ nullable: true })
  swiftCode: string;

  @Field({ nullable: true })
  ifscCode: string;

  @Field({ nullable: true, defaultValue: false })
  isDefault: boolean;
}

@ObjectType('crewDetail', { description: 'Crew Detail' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('operator', () => OperatorDto, { disableRemove: true })
@UnPagedRelation('roles', () => RoleDTO, { disableRemove: true })
@InputType()
export class CrewDetailDto extends BaseDTO {
  @FilterableField(() => [String], {
    allowedComparisons: ['eq', 'neq', 'in', 'notIn'],
    nullable: true,
  })
  roles: string[];

  @Field({ nullable: true })
  profile: string;

  @Field({ nullable: true })
  location: string;

  @FilterableField({ nullable: true })
  designation: string;

  @FilterableField()
  fullName: string;

  @FilterableField({ nullable: true })
  displayName: string;

  @Field(() => Gender, { nullable: true })
  gender: Gender;

  @Field({ nullable: true })
  dateOfBirth: Date;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  alternateContact: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  education: string;

  @Field({ nullable: true })
  experience: string;

  @Field({ nullable: true })
  martialStatus: string;

  @Field({ nullable: true })
  anniversaryDate: Date;

  @Field({ nullable: true })
  religion: string;

  @Field({ nullable: true })
  nationality: string;

  @Field({ nullable: true })
  aadhar: string;

  @Field({ nullable: true })
  pan: string;

  @Field({ nullable: true })
  gst: string;

  @Field({ nullable: true })
  passportNo: string;

  @Field({ nullable: true })
  currentAddress: string;

  @Field({ nullable: true })
  permanentAddress: string;

  @Field({ nullable: true })
  bloodGroup: string;

  @Field(() => [CertificationDto], { nullable: true })
  certifications: CertificationDto[];

  @Field(() => [NomineeDto], { nullable: true })
  nominees: NomineeDto[];

  @FilterableField({ nullable: true })
  operatorId: string;

  // @FilterableField(() => UserType, { defaultValue: UserType.PLATFORM_USER })
  // type: UserType;

  @Field(() => CrewDetailDto, { nullable: true })
  createdByUser?: CrewDetailDto; // ✅ Add this for relation

  @FilterableField({ nullable: true })
  crewId: string;

  @Field(() => [BankDetailDto], { nullable: true })
  bankDetails: BankDetailDto[];
}

@ObjectType()
export class CertificationResponse {
  @Field(() => [GraphQLJSONObject])
  data: string;
  @Field()
  totalCount: number;
}
