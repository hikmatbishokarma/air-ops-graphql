import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class UserInputDto {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  phone: string;

  // @Field()
  // role: string;

  @Field(() => [String])
  roles: string[];

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true, defaultValue: undefined })
  operatorId?: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  user: UserInputDto;
}
