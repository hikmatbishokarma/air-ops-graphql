import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { DepartmentType, SecurityDocType } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { OperatorDto } from 'src/operator/dto/operator.dto';

@ObjectType('security', { description: 'Security' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('operator', () => OperatorDto, { disableRemove: true })
export class SecurityDto extends BaseDTO {
  @FilterableField(() => SecurityDocType, { nullable: true })
  type: SecurityDocType;
  @FilterableField()
  name: string;
  @FilterableField(() => DepartmentType, {
    defaultValue: DepartmentType.OTHERS,
  })
  department: DepartmentType;
  @Field()
  attachment: string;
  @FilterableField({ nullable: true })
  operatorId: string;
}
