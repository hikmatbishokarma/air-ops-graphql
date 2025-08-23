import { Field, InputType } from '@nestjs/graphql';
import { Gender } from 'src/app-constants/enums';
import { BankDetailDto } from '../dto/crew-detail.dto';

@InputType()
export class NomineeInput {
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

@InputType()
export class CertificationInput {
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
@InputType()
export class CrewInput {
  @Field(() => [String])
  roles: string[];

  @Field({ nullable: true })
  profile: string;

  @Field({ nullable: true })
  location: string;

  @Field({ nullable: true })
  designation: string;

  @Field()
  fullName: string;

  @Field()
  displayName: string;

  @Field(() => Gender)
  gender: Gender;

  @Field({ nullable: true })
  dateOfBirth: Date;

  @Field()
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

  @Field(() => [CertificationInput])
  certifications: CertificationInput[];

  @Field(() => [NomineeInput])
  nominees: NomineeInput[];

  @Field({ nullable: true })
  operatorId: string;

  @Field({ nullable: true })
  crewId: string;

  @Field(() => [BankDetailDto], { nullable: true })
  bankDetails: BankDetailDto[];
}

@InputType()
export class CreateCrewInput {
  @Field()
  crew: CrewInput;
}
