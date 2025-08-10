import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { CrewType, Gender, UserType } from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({})
export class NomineeEntity {
  @Prop()
  fullName: string;

  @Prop({
    type: String,
    enum: Gender,
  })
  gender: Gender;

  @Prop()
  relation: string;

  @Prop()
  idProof: string;

  @Prop()
  mobileNumber: string;

  @Prop()
  alternateContact: string;

  @Prop()
  address: string;
  @Prop()
  insurance: string;
}

export const NomineeSchema = SchemaFactory.createForClass(NomineeEntity);

@Schema({})
export class CertificationEntity {
  // @Prop()
  // certification: string;

  // @Prop()
  // validTill: Date;

  // @Prop()
  // uploadCertificate: string;

  @Prop()
  name: string;
  @Prop()
  licenceNo: string;
  @Prop()
  dateOfIssue: Date;
  @Prop()
  issuedBy: string;
  @Prop()
  validTill: Date;
}

export const CertificationSchema =
  SchemaFactory.createForClass(CertificationEntity);

@Schema({ collection: 'crew-details', timestamps: true })
export class CrewDetailEntity extends BaseEntity {
  @Prop([{ type: SchemaTypes.ObjectId, ref: 'RoleEntity', required: true }])
  roles: Types.ObjectId[];

  // @Prop({ type: String, enum: CrewType })
  // type: CrewType;

  @Prop()
  designation: string;

  @Prop()
  profile: string;

  @Prop()
  location: string;
  // User Details
  // @Prop()
  // firstName: string;

  // @Prop()
  // middleName: string;

  // @Prop()
  // lastName: string;

  @Prop()
  fullName: string;

  @Prop()
  displayName: string;

  @Prop()
  gender: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  phone: string;

  @Prop()
  alternateContact: string;

  @Prop()
  email: string;

  @Prop()
  education: string;

  @Prop()
  experience: string;

  @Prop()
  martialStatus: string;

  @Prop()
  anniversaryDate: Date;

  @Prop()
  religion: string;

  @Prop()
  nationality: string;

  @Prop()
  aadhar: string;

  @Prop()
  pan: string;

  @Prop()
  passportNo: string;

  // @Prop()
  // pinCode: string;

  @Prop()
  currentAddress: string;

  @Prop()
  permanentAddress: string;

  @Prop()
  bloodGroup: string;

  // Certifications
  @Prop({ type: [CertificationSchema], default: [] })
  certifications: CertificationEntity[];

  // Nominees
  @Prop({ type: [NomineeSchema], default: [] })
  nominees: NomineeEntity[];

  // Security
  @Prop()
  userName: string;

  @Prop()
  password: string;

  @Prop()
  repeatPassword: string;

  @Prop({ default: false })
  enableTwoFactorAuth: boolean;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'OperatorEntity',
    default: undefined,
  })
  operatorId: Types.ObjectId;

  // @Prop({ type: String, enum: UserType, default: UserType.PLATFORM_USER })
  // type: UserType;
  @Prop()
  crewId: string;
}

export const CrewDetailSchema = SchemaFactory.createForClass(CrewDetailEntity);
