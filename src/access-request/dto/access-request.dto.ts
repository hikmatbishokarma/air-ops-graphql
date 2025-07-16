import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDTO } from 'src/common/dtos/base.dto';

@ObjectType('AccessRequest', { description: 'AccessRequest' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
export class AccessRequestDto extends BaseDTO {
  @FilterableField()
  docType: string;

  @FilterableField()
  docId: string;

  @FilterableField()
  requestedBy: string;

  @FilterableField()
  status: string;

  @FilterableField()
  reviewedBy?: string;

  @FilterableField()
  reviewedAt?: Date;

  @Field({ nullable: true })
  reason?: string;
}
