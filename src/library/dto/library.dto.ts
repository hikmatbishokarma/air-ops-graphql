import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { OperatorDto } from 'src/operator/dto/operator.dto';

@ObjectType('library', { description: 'Library' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('operator', () => OperatorDto, { disableRemove: true })
export class LibraryDto extends BaseDTO {
  @FilterableField()
  name: string;
  @FilterableField()
  department: string;
  @Field()
  attachment: string;
  @FilterableField({ nullable: true })
  operatorId: string;
}
