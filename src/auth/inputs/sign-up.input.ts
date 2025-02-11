import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  name: string;

  @Field()
  password: string;

  @IsEmail()
  @Field()
  email: string;
}
