import { Module } from '@nestjs/common';
import { MailerService } from './services/mailer.service';
import { MailerResolver } from './resolvers/mailer.resolver';
import { QuotesModule } from 'src/quotes/quotes.module';

@Module({
  imports:[QuotesModule],
  providers: [MailerService, MailerResolver],
  exports: [MailerService],
})
export class NotificationModule {}
