import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaveEntity, LeaveSchema } from './entities/leave.entity';
import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { LeaveDto } from './dto/leave.dto';
import { LeaveService } from './services/leave.service';
import { LeaveResolver } from './resolvers/leave.resolver';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: LeaveEntity,
            name: LeaveEntity.name,
            schema: LeaveSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: LeaveDto,
          EntityClass: LeaveEntity,
        },
      ],
    }),
  ],

  providers: [LeaveService, LeaveResolver],
  exports: [LeaveService],
})
export class LeaveModule {}
