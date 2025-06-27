import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class StaffCertificationWhereInput {
  @Field({ nullable: true })
  validTillBefore: Date;
  @Field({ nullable: true })
  search: string;
  @Field({ nullable: true })
  operatorId!: string;
}

@InputType()
export class StaffCertificationInput {
  @Field({ nullable: true })
  where: StaffCertificationWhereInput;
}
