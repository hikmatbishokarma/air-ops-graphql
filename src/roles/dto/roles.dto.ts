import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('role', { description: 'User Roles' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
export class RoleDTO extends BaseDTO {
  @IsString()
  @FilterableField()
  name!: string;
  @IsString()
  @Field()
  description: string;
  @Field(() => [String])
  permission: [string];
  @Field()
  resources: string;
}
