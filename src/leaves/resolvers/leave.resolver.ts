import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LeaveService } from '../services/leave.service';
import {
  UpdateLeaveRequestDataInput,
  UpdateLeaveRequestWhereInput,
} from '../inputs/update-leave-request.input';
import { LeaveDto } from '../dto/leave.dto';

@Resolver()
export class LeaveResolver {
  constructor(private readonly leaveService: LeaveService) {}

  @Mutation(() => LeaveDto)
  async updateLeaveRequest(
    @Args('where') where: UpdateLeaveRequestWhereInput,
    @Args('data') data: UpdateLeaveRequestDataInput,
  ) {
    return this.leaveService.updateLeaveRequest({ where, data });
  }
}
