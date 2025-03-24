import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { ClientType } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('client', { description: 'Client' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
export class ClientsDto extends BaseDTO {
  @FilterableField()
  name: string;
  @FilterableField()
  phone: string;
  @FilterableField()
  email: string;
  @FilterableField({ nullable: true })
  address: string;
  //   @FilterableField(() => ClientType)
  //   type: ClientType;
  @FilterableField()
  isCompany: boolean;
  @FilterableField()
  isPerson: boolean;
}
