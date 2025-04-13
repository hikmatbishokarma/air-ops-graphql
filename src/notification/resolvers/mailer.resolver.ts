import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MailerService } from '../services/mailer.service';
import { MailerResponseDto } from '../dto/mailer.dto';
import { MailerInput } from '../inputs/mailer.input';
import { acknowledgementInput } from '../inputs/acknowledgement.input';

@Resolver()
export class MailerResolver {
  constructor(private readonly mailerService: MailerService) {}

  @Mutation(() => MailerResponseDto)
  async sendEmail(@Args('input') input: MailerInput) {
    const { to, text, subject, html } = input;
    return await this.mailerService.sendEmail(to, subject, text, html);
  }


  @Mutation(() => String)
  async sendAcknowledgement(@Args('input') input: acknowledgementInput) {
    return await this.mailerService.sendAcknowledgement(input);
  }
}
