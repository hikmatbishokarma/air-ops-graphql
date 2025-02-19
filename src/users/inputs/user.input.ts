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

  @Field()
  role: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  user: UserInputDto;
}
