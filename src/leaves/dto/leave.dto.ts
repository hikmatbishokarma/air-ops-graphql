import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { LeaveStatus, LeaveType } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { CrewDetailDto } from 'src/crew-details/dto/crew-detail.dto';
import { OperatorDto } from 'src/operator/dto/operator.dto';

@ObjectType('Leave', { description: 'Leaves' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('crew', () => CrewDetailDto, { disableRemove: true })
@Relation('operator', () => OperatorDto, { disableRemove: true })
export class LeaveDto extends BaseDTO {
  @FilterableField(() => LeaveType)
  type: LeaveType;
  @FilterableField()
  from: Date;
  @FilterableField()
  to: Date;
  @Field()
  reason: string;
  @Field({ nullable: true })
  attachment: string;
  @FilterableField(() => LeaveStatus, { defaultValue: LeaveStatus.PENDING })
  status: LeaveStatus;
  @FilterableField({ nullable: true })
  crewId: string;
  @FilterableField({ nullable: true })
  operatorId: string;
  @Field()
  remark: string;
}
