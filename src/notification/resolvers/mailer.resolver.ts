import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MailerService } from '../services/mailer.service';
import { MailerResponseDto } from '../dto/mailer.dto';
import { MailerInput } from '../inputs/mailer.input';

@Resolver()
export class MailerResolver {
  constructor(private readonly mailerService: MailerService) {}

  @Mutation(() => MailerResponseDto)
  async sendEmail(@Args('input') input: MailerInput) {
    const { to, text, subject, html } = input;
    return await this.mailerService.sendEmail(to, subject, text, html);
  }
}
