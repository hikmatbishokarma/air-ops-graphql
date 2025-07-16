import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';
import {
  AccessRequestEntity,
  AccessRequestSchema,
} from './entities/access-request.entity';
import { AccessRequestDto } from './dto/access-request.dto';
import { AccessRequestService } from './services/access-request.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    NotificationModule,
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: AccessRequestEntity,
            name: AccessRequestEntity.name,
            schema: AccessRequestSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: AccessRequestDto,
          EntityClass: AccessRequestEntity,
        },
      ],
    }),
  ],
  providers: [AccessRequestService],
  exports: [AccessRequestService],
})
export class AccessRequestModule {}
