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

@Module({
  imports: [
    QuotesModule,
    MongooseModule.forFeature([
      { name: NotificationEntity.name, schema: NotificationSchema },
    ]),
  ],
  providers: [
    MailerService,
    MailerResolver,
    NotificationGateway,
    SystemNotificationService,
  ],
  exports: [MailerService, SystemNotificationService],
})
export class NotificationModule {}
