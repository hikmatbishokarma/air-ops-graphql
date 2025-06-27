import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
  UnPagedRelation,
} from '@app/query-graphql';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { CrewType, Gender } from 'src/app-constants/enums';
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
  // @Field({ nullable: true })
  // certification: string;
  // @Field({ nullable: true })
  // validTill: Date;
  // @Field({ nullable: true })
  // uploadCertificate?: string;

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

@ObjectType('crewDetail', { description: 'Crew Detail' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('operator', () => OperatorDto, { disableRemove: true })
@UnPagedRelation('roles', () => RoleDTO, { disableRemove: true })
export class CrewDetailDto extends BaseDTO {
  // @Field(() => CrewType)
  // type: CrewType;

  @FilterableField(() => [String], {
    allowedComparisons: ['eq', 'neq', 'in', 'notIn'],
    nullable: true,
  })
  roles: string[];

  @Field({ nullable: true })
  profile: string;

  @Field({ nullable: true })
  location: string;

  @Field({ nullable: true })
  designation: string;

  // @Field()
  // firstName: string;

  // @Field({ nullable: true })
  // middleName: string;

  // @Field({ nullable: true })
  // lastName: string;

  @FilterableField()
  fullName: string;

  @FilterableField()
  displayName: string;

  @Field(() => Gender)
  gender: Gender;

  @Field({ nullable: true })
  dateOfBirth: Date;

  @Field()
  mobileNumber: string;

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
  passportNo: string;

  // @Field({ nullable: true })
  // pinCode: string;

  @Field({ nullable: true })
  currentAddress: string;

  @Field({ nullable: true })
  permanentAddress: string;

  @Field({ nullable: true })
  bloodGroup: string;

  @Field(() => [CertificationDto])
  certifications: CertificationDto[];

  @Field(() => [NomineeDto])
  nominees: NomineeDto[];

  // Security
  // @Field({ nullable: true })
  // userName: string;

  // @Field({ nullable: true })
  // password: string;

  // @Field({ nullable: true })
  // repeatPassword: string;

  // @Field({ nullable: true })
  // enableTwoFactorAuth: boolean;

  @FilterableField({ nullable: true })
  operatorId: string;
}

@ObjectType()
export class CertificationResponse {
  @Field(() => [GraphQLJSONObject])
  data: string;
  @Field()
  totalCount: number;
}
