import { Module } from '@nestjs/common';
import { MailerService } from './services/mailer.service';
import { MailerResolver } from './resolvers/mailer.resolver';

@Module({
  providers: [MailerService, MailerResolver],
  exports: [MailerService],
})
export class NotificationModule {}
