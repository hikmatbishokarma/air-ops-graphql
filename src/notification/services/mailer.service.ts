import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as puppeteer from 'puppeteer';
import { SalesDocumentType } from 'src/app-constants/enums';
import { QuotePdfTemplate } from '../templates/email.template';
import { QuotesService } from 'src/quotes/services/quotes.service';
import { InvoiceTemplate } from '../templates/invoice.template';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    // host: process.env.EMAIL_HOST, // Example: smtp.example.com
    // port: parseInt(process.env.EMAIL_PORT, 10), // Example: 587
    // secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587/25
    // auth: {
    //   user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_PASS,
    // },

    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: 'hikmatbk101@gmail.com',
      pass: 'bdwv lmcm gyud zkyb', //bdwv lmcm gyud zkyb
    },
  });

  constructor(
    private readonly config: ConfigService,
    private readonly quoteService: QuotesService,
  ) {}

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
    attachments?: any,
  ) {
    try {
      await this.transporter.sendMail({
        from: `"Airops" <${process.env.EMAIL_USER}>`, // Custom sender name
        to,
        subject,
        text,
        html,
        attachments,
      });
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, message: error.message };
    }
  }

  async createPDF(filePath: string, htmlContent: string): Promise<string> {
    const isLocal = true;

    const browser = await puppeteer.launch({
      headless: true, // Use `true` instead of `"new"`
      args: isLocal
        ? []
        : [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--single-process',
          ],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent);
    // ✅ Alternative to waitForTimeout
    // await page.waitForFunction(() => document.readyState === 'complete');

    await page.pdf({ path: filePath, format: 'A4' });

    await browser.close();
    return filePath;
  }

  async sendAcknowledgement(args) {
    const { quotationNo, email, documentType } = args;
    if (!documentType)
      throw new BadRequestException('documentType is required');

    const quote = await this.quoteService.getQuoteById(quotationNo);
    if (!quote) throw new BadRequestException('No Quote Found');

    let htmlContent;

    let filePath = 'salesDoc.pdf',
      subject = '',
      text = '';

    const to = email || quote?.client?.email;

    if (documentType == SalesDocumentType.QUOTATION) {
      htmlContent = QuotePdfTemplate(quote);
      filePath = 'quote.pdf';

      subject = `Your Flight Quote - Reference No. ${quote?.revisedQuotationNo || quote?.quotationNo} `;
      text = `We are Pleased to offer to you the ${quote?.aircraftDetail?.name}`;
    }

    if (documentType == SalesDocumentType.INVOICE) {
      htmlContent = InvoiceTemplate(quote);
      subject = `Your Flight Invoice - Reference No. ${quote?.proformaInvoiceNo} `;
      filePath = 'invoice.pdf';
    }

    const pdfPath = await this.createPDF(filePath, htmlContent);

    const attachments = [{ filename: 'document.pdf', path: pdfPath }];

    await this.sendEmail(to, subject, text, null, attachments);

    return 'PDF sent successfully!';
  }
}
