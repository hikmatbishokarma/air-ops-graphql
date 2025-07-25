import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDTO } from '../dto/users.dto';

import { UserEntity } from '../entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseQueryService } from '@app/query-mongoose';
import { RolesService } from 'src/roles/services/roles.service';
import { RoleType, UserType } from 'src/app-constants/enums';
import {
  comparePassword,
  generatePassword,
  hashPassword,
} from 'src/common/helper';
import { MailerService } from 'src/notification/services/mailer.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserInput } from '../inputs/user.input';
import { getTempPasswordEmailText } from 'src/notification/templates/temp-pwd-email.template';
import { OperatorService } from 'src/operator/services/operator.service';

@Injectable()
export class UsersService extends MongooseQueryService<UserEntity> {
  private url: string;
  constructor(
    @InjectModel(UserEntity.name) model: Model<UserEntity>,
    private readonly roleService: RolesService,
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
    private readonly operatorService: OperatorService,
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

  // async getUserByUserNameV1(userName) {
  //   const [user] = await this.query({
  //     filter: {
  //       or: [{ email: { eq: userName } }, { phone: { eq: userName } }],
  //     },
  //   });

  //   const role = await this.roleService.findById(user.role.toString());

  //   return {
  //     id: user.id,
  //     name: user.name,
  //     email: user.email,
  //     password: user.password,
  //     image: user.image,
  //     role: {
  //       type: role?.type,
  //       name: role.name,
  //       accessPermissions: role.accessPermissions,
  //     },
  //   };
  // }

  async getUserByUserName(userName) {
    let [user] = await this.query({
      filter: {
        or: [{ email: { eq: userName } }, { phone: { eq: userName } }],
      },
    });

    if (!user) throw new Error('User not found');
    user = user.toObject();

    let operator;
    if (user.operatorId) {
      operator = await this.operatorService.findById(
        user.operatorId.toString(),
      );
    }

    const roles = await this.roleService.query({
      filter: { id: { in: user.roles } },
    });

    if (roles.length === 0) throw new Error('Role not found');

    const rolesSet = new Set<string>();
    const permissionsMap = new Map<string, Set<string>>();

    roles.forEach((role) => {
      rolesSet.add(role.type);

      role.accessPermissions.forEach((perm) => {
        const existing = permissionsMap.get(perm.resource) || new Set<string>();
        perm.action.forEach((act) => existing.add(act));
        permissionsMap.set(perm.resource, existing);
      });
    });

    // Convert Sets to final unique arrays
    const uniqueRoles = Array.from(rolesSet);

    const permissions = Array.from(permissionsMap.entries()).map(
      ([resource, actionsSet]) => ({
        resource,
        action: Array.from(actionsSet),
      }),
    );

    return {
      // id: user.id,
      // name: user.name,
      // email: user.email,
      // password: user.password,
      // image: user.image,
      // // role: {
      // //   type: role?.type || RoleType.USER,
      // //   name: role.name,
      // //   accessPermissions: role.accessPermissions,
      // // },
      ...user,
      id: user._id,
      roles: uniqueRoles,
      permissions,
      operator,
    };
  }

  async createOneUser(user, currentUser) {
    const createdBy = currentUser?.id || currentUser?.sub;
    user.createdBy = createdBy;
    const { password, operatorId } = user;

    const tempPassword = !password ? generatePassword(8) : password;

    const hashedPassword = await hashPassword(tempPassword);
    user['password'] = hashedPassword;
    user.type = operatorId ? UserType.AGENT_USER : UserType.PLATFORM_USER;

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

  async forgotPassword(email: string) {
    const [user] = await this.query({ filter: { email: { eq: email } } });
    if (user) {
      const tempPassword = generatePassword(8);

      const hashedPassword = await hashPassword(tempPassword);

      const updatePwd = await this.updateOne(user.id, {
        password: hashedPassword,
      });
      if (updatePwd) {
        /**
         * notify user with random password
         */
        const subject = 'Your Temporary Password for Login';

        const resetUrl = `${this.url}reset-password`;
        const emailText = getTempPasswordEmailText(
          user,
          tempPassword,
          resetUrl,
        );
        this.mailerService.sendEmail(user.email, subject, emailText);

        return {
          message: `Temporary password send to your register email:${user.email}`,
          status: true,
        };
      } else return { message: `Failed to reset password`, status: false };
    } else
      return {
        message: `Provided email: ${email} doesn't exist`,
        status: false,
      };
  }

  async resetPassword(
    userId,
    currentPwd: string,
    newPwd: string,
    confirmPwd: string,
  ) {
    const [user] = await this.query({ filter: { id: { eq: userId } } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await comparePassword(currentPwd, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Current password is incorrect');
    if (newPwd !== confirmPwd) {
      throw new BadRequestException(
        'New password does not match confirmation password',
      );
    }

    const hashedPassword = await hashPassword(newPwd);

    const updatePwd = await this.updateOne(user.id, {
      password: hashedPassword,
    });

    if (!updatePwd) {
      throw new BadRequestException('Failed to reset password');
    }
    return {
      status: true,
      message: 'Password reset successfully',
    };
  }

  async createOperatorAsAdmin(args) {
    const role = await this.getRoleByType(RoleType.ADMIN);
    if (!role) throw new Error('Admin Role Not Found');

    const tempPassword = generatePassword(8);

    const hashedPassword = await hashPassword(tempPassword);

    // Auto-merge role, password and any future props in `args`
    const payload = {
      name: args.name,
      email: args.email,
      phone: args.phone,
      operatorId: args.operatorId,
      address: args.address,
      city: args.city,
      state: args.state,
      pinCode: args.pinCode,
      password: hashedPassword,
      role: role.id,
      roles: [role.id],
      type: UserType.AGENT_ADMIN,
    };

    const user = await this.createOne(payload);
    if (!user) throw new Error('Failed To Signup User');

    const subject = 'Your Temporary Password for Login';
    const resetUrl = `${this.url}reset-password`;
    const emailText = getTempPasswordEmailText(user, tempPassword, resetUrl);

    this.mailerService.sendEmail(user.email, subject, emailText);

    return user;
  }
}
