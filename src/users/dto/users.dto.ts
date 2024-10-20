import { Field, ObjectType } from '@nestjs/graphql';

export class UserDTO {
  id: number;
  name: string;
  password: string;
}

@ObjectType({ description: 'user dto' })
export class UserDTOG {
  @Field()
  id: number;
  @Field()
  name: string;
  @Field()
  password: string;
}
