import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { AircraftCategoriesDto } from 'src/aircraft-categories/dto/aircraft-categories.dto';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('Aircraft', { description: 'Aircraft' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('category', () => AircraftCategoriesDto, { disableRemove: true })
export class AircraftDto extends BaseDTO {
  @FilterableField()
  name: string;
  @FilterableField()
  category: string;
}
