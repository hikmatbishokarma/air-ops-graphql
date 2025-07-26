import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('notification')
export class SystemNotificationDto extends BaseDTO {
  @Field()
  type: string;
  @Field()
  refType: string;
  @Field()
  refId: string;
  @Field()
  message: string;
  @Field({ nullable: true })
  title?: string;
  @Field(() => [String], { nullable: true })
  recipientRoles?: string[];
  @Field(() => [String], { nullable: true })
  recipientIds?: string[];
  @Field(() => GraphQLJSONObject, { nullable: true })
  metadata?: object;
  @Field(() => [String], { nullable: true })
  isReadBy: string[];
}
