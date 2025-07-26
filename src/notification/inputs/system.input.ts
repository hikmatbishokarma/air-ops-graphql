import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SystemNotificationWhereInput {
  @Field({ nullable: true })
  type: string;
  @Field({ nullable: true })
  refType: string;
  @Field({ nullable: true })
  refId: string;
}

@InputType()
export class MarkAsReadInput {
  @Field(() => [String])
  notificationIds: string[];
  @Field()
  userId: string;
}
