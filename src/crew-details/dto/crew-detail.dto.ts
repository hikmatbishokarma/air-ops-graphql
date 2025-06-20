import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CrewType, Gender } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { OperatorDto } from 'src/operator/dto/operator.dto';

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
}

@ObjectType()
@InputType('certificationInput')
export class CertificationDto {
  @Field({ nullable: true })
  certification: string;
  @Field({ nullable: true })
  validTill: Date;
  @Field({ nullable: true })
  uploadCertificate?: string;
}

@ObjectType('crewDetail', { description: 'Crew Detail' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('operator', () => OperatorDto, { disableRemove: true })
export class CrewDetailDto extends BaseDTO {
  @Field(() => CrewType)
  type: CrewType;

  @Field({ nullable: true })
  profile: string;

  @Field({ nullable: true })
  location: string;

  @Field()
  firstName: string;

  @Field({ nullable: true })
  middleName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field(() => Gender)
  gender: Gender;

  @Field({ nullable: true })
  dateOfBirth: Date;

  @Field({ nullable: true })
  bloodGroup: string;

  @Field({ nullable: true })
  designation: string;

  @Field({ nullable: true })
  education: string;

  @Field({ nullable: true })
  experience: string;

  @Field()
  mobileNumber: string;

  @Field({ nullable: true })
  alternateContact: string;

  @Field({ nullable: true })
  email: string;

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

  @Field({ nullable: true })
  pinCode: string;

  @Field({ nullable: true })
  temporaryAddress: string;

  @Field({ nullable: true })
  permanentAddress: string;

  @Field(() => [CertificationDto])
  certifications: CertificationDto[];

  @Field(() => [NomineeDto])
  nominees: NomineeDto[];

  // Security
  @Field({ nullable: true })
  userName: string;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  repeatPassword: string;

  @Field({ nullable: true })
  enableTwoFactorAuth: boolean;

  @FilterableField({ nullable: true })
  operatorId: string;
}
