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

  @Query(() => MailerResponseDto)
  async generateAndSendPdf() {
    const filePath = 'output.pdf';
    const htmlContent = `<h1>Hello, this is a PDF</h1><p>Generated from HTML</p>`;
    const to = 'bkhikmat5024@gmail.com';
    const subject = 'PDF';
    const text = 'pdf send';

    const pdfPath = await this.mailerService.createPDF(filePath, htmlContent);

    const attachments = [{ filename: 'document.pdf', path: pdfPath }];

    await this.mailerService.sendEmail(to, subject, text, null, attachments);

    return { message: 'PDF sent successfully!' };
  }
}
