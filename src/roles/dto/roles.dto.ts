import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  UnPagedRelation,
} from '@app/query-graphql';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { RoleType } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { RolePermissionDTO } from 'src/role-permission/dto/role-permission.dto';

@ObjectType('role', { description: 'User Roles' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
@UnPagedRelation('rolePermissions', () => RolePermissionDTO, {
  disableRemove: true,
  nullable: true,
})
export class RoleDTO extends BaseDTO {
  @FilterableField(() => RoleType)
  roleType: RoleType;
  @IsString()
  @FilterableField()
  name: string;
  @IsString()
  @Field()
  description: string;
}
