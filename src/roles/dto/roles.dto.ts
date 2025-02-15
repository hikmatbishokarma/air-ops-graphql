import {
  FilterableField,
  PagingStrategies,
  QueryOptions,
  Relation,
  UnPagedRelation,
} from '@app/query-graphql';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Permissions, ResourceAction, RoleType } from 'src/app-constants/enums';
import { BaseDTO } from 'src/common/dtos/base.dto';
import { ResourceDto } from 'src/resource/dto/resource.dto';
import { RolePermissionDTO } from 'src/role-permission/dto/role-permission.dto';

@ObjectType()
@InputType('accessPermissionInput')
export class AccessPermissionInput {
  @Field()
  resource: string;
  @Field(() => [ResourceAction])
  action: ResourceAction[];
}

@ObjectType('role', { description: 'User Roles' })
@QueryOptions({
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
})
// @UnPagedRelation('resources', () => ResourceDto, {
//   disableRemove: true,
//   nullable: true,
// })
export class RoleDTO extends BaseDTO {
  @FilterableField(() => RoleType)
  roleType: RoleType;
  @IsString()
  @FilterableField()
  name: string;
  @IsString()
  @Field({ nullable: true })
  description: string;
  // @Field(() => [Permissions])
  // permissions: Permissions[];
  // @Field(() => [String])
  // resources: string[];
  @Field(() => [AccessPermissionInput])
  accessPermission: AccessPermissionInput[];
}
