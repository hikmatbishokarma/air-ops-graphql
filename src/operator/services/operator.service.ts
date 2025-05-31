import { MongooseQueryService } from '@app/query-mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OperatorEntity } from '../entities/operator.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OperatorDto } from '../dto/operator.dto';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class OperatorService extends MongooseQueryService<OperatorEntity> {
  constructor(
    @InjectModel(OperatorEntity.name) model: Model<OperatorEntity>,
    // private readonly userService: UsersService,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
  ) {
    super(model);
  }

  async createOperator(input, currentUser) {
    const createdBy = currentUser.id || currentUser.sub;

    //check the duplicate

    const user = await this.userService.query({
      filter: {
        or: [{ email: { eq: input.email } }, { phone: { eq: input.phone } }],
      },
    });
    if (user.length > 0) throw new Error('User already exists');

    const operator = await this.createOne({
      ...input,
      createdBy,
    });

    if (!operator) throw new Error('Failed to create operator');

    const createUser = await this.userService.createOperatorAsAdmin({
      ...operator?.toObject(),
      operatorId: operator.id,
      createdBy,
    });

    if (!createUser) throw new Error('Failed to create user');

    return operator;
  }

  async getUserById(id: string) {
    return await this.userService.findById(id);
  }
}
