import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { OperatorDto } from 'src/operator/dto/operator.dto';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('AircraftCategory', { description: 'AircraftCategory' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('operator', () => OperatorDto, { disableRemove: true })
export class AircraftCategoriesDto extends BaseDTO {
  @FilterableField()
  name: string;
  @FilterableField()
  description: string;
  @FilterableField({ nullable: true })
  operatorId: string;
}
