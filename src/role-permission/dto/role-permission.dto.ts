import {
  FilterableField,
  KeySet,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { ResourceAction } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { RoleDTO } from 'src/roles/dto/roles.dto';

export class PermissionDTO {
  @Field()
  resource: string;
  @Field(() => [ResourceAction])
  action: ResourceAction[];
}

@ObjectType('RolePermission', { description: 'Role Permission' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@KeySet(['id'])
@Relation('role', () => RoleDTO, { disableRemove: true })
export class RolePermissionDTO extends BaseDTO {
  @FilterableField(() => String)
  role: string;
  @Field(() => [GraphQLJSONObject])
  permissions!: PermissionDTO[];
}
