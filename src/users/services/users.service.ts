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
import { RoleType } from 'src/app-constants/enums';
import {
  comparePassword,
  generatePassword,
  hashPassword,
} from 'src/common/helper';
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
      image: user.image,
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
        const text = `Dear ${user.name},\n\nWe received a request to reset your password. Here are your temporary login details:\n\nEmail: ${user.email}\nTemporary Password: ${tempPassword}\n\nPlease use the link below to log in and reset your password immediately:\n\nReset Password: ${this.url}reset-password\n\nIf you didn’t request this, please ignore this email or contact our support team.\n\nBest regards,\nAirops Support Team`;

        this.mailerService.sendEmail(user.email, subject, text);
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
}
