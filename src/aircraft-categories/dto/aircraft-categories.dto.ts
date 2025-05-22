import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { ObjectType } from '@nestjs/graphql';
import { AgentDto } from 'src/agent/dto/agent.dto';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('AircraftCategory', { description: 'AircraftCategory' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('agent', () => AgentDto, { disableRemove: true })
export class AircraftCategoriesDto extends BaseDTO {
  @FilterableField()
  name: string;
  @FilterableField()
  description: string;
  @FilterableField({ nullable: true })
  agentId: string;
}
