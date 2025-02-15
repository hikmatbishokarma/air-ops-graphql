import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('resource', { description: 'resource' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
export class ResourceDto extends BaseDTO {
  @FilterableField()
  menu: string;
  @Field()
  segment: string;
  @Field()
  title: string;
  @Field()
  icon: string;
}
