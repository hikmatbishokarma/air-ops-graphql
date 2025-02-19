import { Injectable } from '@nestjs/common';
import { UserDTO } from '../dto/users.dto';

import { UserEntity } from '../entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseQueryService } from '@app/query-mongoose';
import { RolesService } from 'src/roles/services/roles.service';
import { RoleType } from 'src/app-constants/enums';
import { generatePassword, hashPassword } from 'src/common/helper';
import { MailerService } from 'src/notification/services/mailer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService extends MongooseQueryService<UserEntity> {
  private url: string;
  constructor(
    @InjectModel(UserEntity.name) model: Model<UserEntity>,
    private readonly roleService: RolesService,
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {
    super(model);
    this.url = config.get<string>('url');
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

  async createOneUser(user) {
    const { password } = user;

    const tempPassword = !password ? generatePassword(8) : password;

    const hashedPassword = await hashPassword(tempPassword);
    user['password'] = hashedPassword;

    const result = await this.createOne(user);
    if (result) {
      /**
       * notify user with random password
       */
      const subject = 'Welcome to Airops – Your Account Details';
      const text = `Dear ${user.name},\n\nWelcome to Airops! Here are your login details:\n\nEmail: ${user.email}\nTemporary Password: ${tempPassword}\n\nPlease log in and change your password immediately.\n\n Login Here:${this.url}sign-in.\n\nBest regards,\nAirops\nSupport Team`;

      this.mailerService.sendEmail(user.email, subject, text);
      return result;
    } else {
      throw new Error('Failed to create user');
    }
  }
}
