import { PagingStrategies, QueryOptions } from '@app/query-graphql';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CrewType, Gender } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType()
@InputType('nomineeInput')
export class NomineeDto {
  @Field()
  fullName: string;
  @Field(() => Gender)
  gender: Gender;
  @Field()
  relation: string;
  @Field()
  idProof: string;
  @Field()
  mobileNumber: string;
  @Field()
  alternateContact: string;
}

@ObjectType()
@InputType('certificationInput')
export class CertificationDto {
  @Field()
  certification: string;
  @Field()
  validTill: Date;
  @Field()
  uploadCertificate?: string;
}

@ObjectType('crewDetail', { description: 'Crew Detail' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
export class CrewDetailDto extends BaseDTO {
  @Field(() => CrewType)
  type: CrewType;

  @Field()
  profile: string;

  @Field()
  location: string;

  @Field()
  firstName: string;

  @Field()
  middleName: string;

  @Field()
  lastName: string;

  @Field(() => Gender)
  gender: Gender;

  @Field()
  dateOfBirth: Date;

  @Field()
  bloodGroup: string;

  @Field()
  designation: string;

  @Field()
  education: string;

  @Field()
  experience: string;

  @Field()
  mobileNumber: string;

  @Field()
  alternateContact: string;

  @Field()
  email: string;

  @Field()
  aadharCard: string;

  @Field()
  pan: string;

  @Field()
  passportNo: string;

  @Field()
  pinCode: string;

  @Field()
  temporaryAddress: string;

  @Field()
  permanentAddress: string;

  @Field(() => [CertificationDto])
  certifications: CertificationDto[];

  @Field(() => [NomineeDto])
  nominees: NomineeDto[];

  // Security
  @Field()
  userName: string;

  @Field()
  password: string;

  @Field()
  repeatPassword: string;

  @Field()
  enableTwoFactorAuth: boolean;
}
