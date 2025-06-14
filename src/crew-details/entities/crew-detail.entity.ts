import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CrewType, Gender } from 'src/app-constants/enums';
import { BaseEntity } from 'src/common/entities/base.entity';

@Schema({ _id: false })
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
}

export const NomineeSchema = SchemaFactory.createForClass(NomineeEntity);

@Schema({ _id: false })
export class CertificationEntity {
  @Prop()
  certification: string;

  @Prop()
  validTill: Date;

  @Prop()
  uploadCertificate: string;
}

export const CertificationSchema =
  SchemaFactory.createForClass(CertificationEntity);

@Schema({ collection: 'crew-details', timestamps: true })
export class CrewDetailEntity extends BaseEntity {
  @Prop({ type: String, enum: CrewType })
  type: CrewType;

  @Prop()
  profile: string;

  @Prop()
  location: string;
  // User Details
  @Prop()
  firstName: string;

  @Prop()
  middleName: string;

  @Prop()
  lastName: string;

  @Prop()
  gender: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  bloodGroup: string;

  @Prop()
  designation: string;

  @Prop()
  education: string;

  @Prop()
  experience: string;

  @Prop()
  mobileNumber: string;

  @Prop()
  alternateContact: string;

  @Prop()
  email: string;

  @Prop()
  uid: string;

  @Prop()
  pan: string;

  @Prop()
  passportNo: string;

  @Prop()
  pinCode: string;

  @Prop()
  temporaryAddress: string;

  @Prop()
  permanentAddress: string;

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
}

export const CrewDetailSchema = SchemaFactory.createForClass(CrewDetailEntity);
