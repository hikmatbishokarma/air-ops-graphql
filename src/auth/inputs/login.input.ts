import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoginInput {
  @Field({ description: 'userName will be email or phone' })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;
}
