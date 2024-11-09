import { Field, ObjectType } from '@nestjs/graphql';

export class signInDTO {
  username: string;
  password: string;
}

@ObjectType()
export class loginResponseDTO {
  @Field()
  access_token: string;
}
