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
import { AccessRequestResolver } from './resolvers/access-request.resolver';
import { ManualModule } from 'src/manual/manual.module';

@Module({
  imports: [
    NotificationModule,
    ManualModule,
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
  providers: [AccessRequestService, AccessRequestResolver],
  exports: [AccessRequestService],
})
export class AccessRequestModule {}
