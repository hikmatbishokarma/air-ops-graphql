import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { AgentDto } from 'src/agent/dto/agent.dto';
import { ClientType } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('client', { description: 'Client' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('agent', () => AgentDto, { disableRemove: true })
export class ClientsDto extends BaseDTO {
  @Field()
  name: string;
  @FilterableField({ nullable: false })
  phone: string;
  @FilterableField({ nullable: false })
  email: string;
  @FilterableField({ nullable: false })
  address: string;

  @FilterableField()
  isCompany: boolean;
  @FilterableField()
  isPerson: boolean;
  @FilterableField({ nullable: true })
  agentId: string;
}
