import { Module } from '@nestjs/common';
import { MailerService } from './services/mailer.service';
import { MailerResolver } from './resolvers/mailer.resolver';
import { QuotesModule } from 'src/quotes/quotes.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotificationEntity,
  NotificationSchema,
} from './entities/notification.entity';
import { NotificationGateway } from './services/notification.gateway';
import { SystemNotificationService } from './services/system.service';
import { NotificationController } from './controllers/notification.controller';
import { SystemNotificationResolver } from './resolvers/system.resolver';
import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { SystemNotificationDto } from './dto/system.dto';

@Module({
  imports: [
    QuotesModule,
    MongooseModule.forFeature([
      { name: NotificationEntity.name, schema: NotificationSchema },
    ]),

    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: NotificationEntity,
            name: NotificationEntity.name,
            schema: NotificationSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: SystemNotificationDto,
          EntityClass: NotificationEntity,
        },
      ],
    }),
  ],
  providers: [
    MailerService,
    MailerResolver,
    NotificationGateway,
    SystemNotificationService,
    SystemNotificationResolver,
  ],
  controllers: [NotificationController],
  exports: [MailerService, SystemNotificationService],
})
export class NotificationModule {}
