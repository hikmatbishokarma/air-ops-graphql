import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
} from '@app/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('AircraftCategory', { description: 'AircraftCategory' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
export class AircraftCategoriesDto extends BaseDTO {
  @FilterableField()
  name: string;
  @FilterableField()
  description: string;
}
