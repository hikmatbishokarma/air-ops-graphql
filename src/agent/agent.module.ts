import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';

import { AgentEntity, AgentSchema } from './entities/agent.entity';
import { AgentDto } from './dto/agent.dto';

import { AgentResolver } from './resolvers/agent.resolver';
import { AgentService } from './services/agent.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: AgentEntity,
            name: AgentEntity.name,
            schema: AgentSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: AgentDto,
          EntityClass: AgentEntity,
        },
      ],
    }),
  ],
  providers: [AgentResolver, AgentService],
  exports: [AgentService],
})
export class AgentModule {}
