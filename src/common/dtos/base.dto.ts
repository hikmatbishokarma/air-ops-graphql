import { FilterableField } from '@app/query-graphql';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export abstract class BaseDTO {
  @Field(() => ID)
  id!: string;

  @Field({
    nullable: true,
    description: 'The date when the record was created',
  })
  createdAt?: Date;

  @Field({
    nullable: true,
    description: 'The email of the user who created the record',
  })
  createdBy?: string;

  @Field({
    nullable: true,
    description: 'The date when the record was last updated',
  })
  updatedAt?: Date;

  @Field({
    nullable: true,
    description: 'The email of the user who last updated the record',
  })
  updatedBy?: string;

  @Field({
    nullable: true,
    description: 'The date when the record was deleted',
  })
  deletedAt?: Date;

  @Field({
    nullable: true,
    description: 'The email of the user who deleted the record',
  })
  deletedBy?: string;

  // @Field(() => [String], {
  //   nullable: true,
  //   description: 'The roles assigned to the user',
  // })
  // roles?: string[];
  @FilterableField(() => Boolean, { defaultValue: true })
  isActive: boolean;
}
