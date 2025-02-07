import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { ClientType } from 'src/app-constants/enums';
import { ClientsDto } from 'src/clients/dto/clients.dto';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('representative', { description: 'Representative' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('client', () => ClientsDto, { disableRemove: true })
export class RepresentativeDto extends BaseDTO {
  @FilterableField()
  name: string;
  @FilterableField()
  phone: string;
  @FilterableField()
  email: string;
  @FilterableField()
  address: string;
  @FilterableField()
  client: string;
}
