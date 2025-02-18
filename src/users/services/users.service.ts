import { Injectable } from '@nestjs/common';
import { UserDTO } from '../dto/users.dto';

import { UserEntity } from '../entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseQueryService } from '@app/query-mongoose';
import { RolesService } from 'src/roles/services/roles.service';
import { RoleType } from 'src/app-constants/enums';

@Injectable()
export class UsersService extends MongooseQueryService<UserEntity> {
  constructor(
    @InjectModel(UserEntity.name) model: Model<UserEntity>,
    private readonly roleService: RolesService,
  ) {
    super(model);
  }

  private readonly users = [
    {
      id: 1,
      name: 'john',
      password: 'changeme',
    },
    {
      id: 2,
      name: 'maria',
      password: 'guess',
    },
  ];

  // async findOne(username: string): Promise<UserDTO | undefined> {
  //   return this.users.find((user) => user.name === username);
  // }

  async getRoleByType(roleType) {
    const [role] = await this.roleService.query({
      filter: { type: { eq: roleType } },
    });
    return role;
  }

  async getUserByUserName(userName) {
    const [user] = await this.query({
      filter: {
        or: [{ email: { eq: userName } }, { phone: { eq: userName } }],
      },
    });

    const role = await this.roleService.findById(user.role.toString());

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: {
        type: role?.type || RoleType.USER,
        name: role.name,
        accessPermissions: role.accessPermissions,
      },
    };
  }
}
