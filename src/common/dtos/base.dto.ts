import { FilterableField, Relation } from '@app/query-graphql';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CrewDetailDto } from 'src/crew-details/dto/crew-detail.dto';

// @ObjectType({ isAbstract: true })
@ObjectType()
export abstract class BaseDTO {
  @FilterableField(() => ID)
  id!: string;

  @FilterableField({
    nullable: true,
    description: 'The date when the record was created',
  })
  createdAt?: Date;

  @Field({
    nullable: true,
    description: 'The id of the user who created the record',
  })
  createdBy?: string;

  @FilterableField({
    nullable: true,
    description: 'The date when the record was last updated',
  })
  updatedAt?: Date;

  @Field({
    nullable: true,
    description: 'The id of the user who last updated the record',
  })
  updatedBy?: string;

  @Field({
    nullable: true,
    description: 'The date when the record was deleted',
  })
  deletedAt?: Date;

  @Field({
    nullable: true,
    description: 'The id of the user who deleted the record',
  })
  deletedBy?: string;

  @FilterableField(() => Boolean, { defaultValue: true })
  isActive: boolean;
}
