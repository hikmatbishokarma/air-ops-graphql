import { MongooseQueryService } from '@app/query-mongoose';
import { Injectable } from '@nestjs/common';
import { AgentEntity } from '../entities/agent.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AgentDto } from '../dto/agent.dto';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AgentService extends MongooseQueryService<AgentEntity> {
  constructor(
    @InjectModel(AgentEntity.name) model: Model<AgentEntity>,
    private readonly userService: UsersService,
  ) {
    super(model);
  }

  async createAgent(input, currentUser) {
    const createdBy = currentUser.id || currentUser.sub;
    const agent = await this.createOne({
      ...input,
      createdBy,
    });

    if (!agent) throw new Error('Failed to create agent');

    const createUser = await this.userService.createAgentAsAdmin({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      agentId: agent.id,
      createdBy,
    });

    if (!createUser) throw new Error('Failed to create user');

    return agent;
  }

  async getUserById(id: string) {
    return await this.userService.findById(id);
  }
}
