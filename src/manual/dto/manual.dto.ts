import {
  BeforeCreateOne,
  BeforeUpdateOne,
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { OperatorDto } from 'src/operator/dto/operator.dto';

import { CrewDetailDto } from 'src/crew-details/dto/crew-detail.dto';
import { CreatedByHook } from 'src/common/hooks/created-by.hook';
import { UpdatedByHook } from 'src/common/hooks/updated-by.hook';

@ObjectType('manual', { description: 'Manual' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('operator', () => OperatorDto, { disableRemove: true })
@Relation('createdBy', () => CrewDetailDto, {
  disableRemove: true,
  nullable: true,
})
@Relation('updatedBy', () => CrewDetailDto, {
  disableRemove: true,
  nullable: true,
})
@BeforeCreateOne(CreatedByHook)
@BeforeUpdateOne(UpdatedByHook)
export class ManualDto extends BaseDTO {
  @FilterableField()
  name: string;
  @FilterableField()
  department: string;
  @Field()
  attachment: string;
  @FilterableField({ nullable: true })
  operatorId: string;
}
