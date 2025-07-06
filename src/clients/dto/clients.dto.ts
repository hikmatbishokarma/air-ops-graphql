import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { OperatorDto } from 'src/operator/dto/operator.dto';
import { ClientType } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('client', { description: 'Client' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@Relation('operator', () => OperatorDto, { disableRemove: true })
export class ClientsDto extends BaseDTO {
  @Field()
  name: string;
  @Field({ nullable: true })
  lastName: string;
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
  operatorId: string;
  @FilterableField({ nullable: true })
  panNo: string;
  @FilterableField({ nullable: true })
  gstNo: string;
  @Field({ nullable: true })
  billingAddress: string;
}
