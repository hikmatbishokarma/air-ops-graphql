import { BeforeCreateOneHook, CreateOneInputType } from '@app/query-graphql';
import { UserDTO } from '../dto/users.dto';
import { GqlContextType } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { RoleType, UserType } from 'src/app-constants/enums';
import { generatePassword, hashPassword } from 'src/common/helper';
import { RolesService } from 'src/roles/services/roles.service';

@Injectable()
export class CreateUserHook<T extends UserDTO>
  implements BeforeCreateOneHook<T, GqlContextType>
{
  constructor(readonly roleService: RolesService) {}
  async run(
    instance: CreateOneInputType<T>,
    context: GqlContextType,
  ): Promise<CreateOneInputType<T>> {
    const { input } = instance;

    const { password, operatorId } = input;
    input.type = operatorId ? UserType.AGENT_USER : UserType.PLATFORM_USER;

    // // Validate password requirement for CUSTOMER and ADMIN roles
    // if (!password && [RoleType.PARTNER, RoleType.ADMIN].includes(roleType))
    //   throw new Error('password is required');

    // // For PARTNER and CUSTOMER role: Fetch and assign the customer role ID automatically
    // if ([RoleType.USER, RoleType.PARTNER].includes(roleType)) {
    //   const [role] = await this.roleService.query({
    //     filter: { roleType: { eq: roleType } },
    //   });
    //   input.role = role.id;
    // }

    // // Hash password for PARTNER and ADMIN roles if password is provided
    // if ([RoleType.PARTNER, RoleType.ADMIN].includes(roleType) && password) {
    //   const hashedPassword = await hashPassword(password);
    //   input.password = hashedPassword;
    // }

    const _password = !password ? generatePassword(8) : password;

    input.password = _password;

    return instance;
  }
}
