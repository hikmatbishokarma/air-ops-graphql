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

  async createAgent(input) {
    const agent = await this.createOne(input);

    if (!agent) throw new Error('Failed to create agent');

    const user = await this.userService.createAgentAsAdmin({
      name: agent.basic.name,
      email: agent.basic.email,
      phone: agent.basic.phone,
      agentId: agent.id,
    });

    if (!user) throw new Error('Failed to create user');

    return agent;
  }
}
