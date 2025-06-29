import { FilterableField } from '@app/query-graphql';
import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { LeaveStatus } from 'src/app-constants/enums';

// export class UpdateLeaveRequestInput {
//   @Field()
//   where: UpdateLeaveRequestWhereInput;
//   @Field()
//   data: UpdateLeaveRequestDataInput;
// }

@InputType()
export class UpdateLeaveRequestWhereInput {
  @Field(() => ID)
  id!: string;
}

@InputType()
export class UpdateLeaveRequestDataInput {
  @Field(() => LeaveStatus, { defaultValue: LeaveStatus.PENDING })
  status: LeaveStatus;
  @Field({ nullable: true })
  remark: string;
}
