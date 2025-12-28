import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as puppeteer from 'puppeteer';
import { SalesDocumentType } from 'src/app-constants/enums';
import { QuotePdfTemplate } from '../templates/quote.template';
import { QuotesService } from 'src/quotes/services/quotes.service';
import { InvoiceTemplate } from '../templates/invoice.template';
import { SaleConfirmationTemplate } from '../templates/sale-confirmation';
import { InvoiceService } from 'src/quotes/services/invoice.service';
import {
  createPDF,
  createPDFBuffer,
  inlineImagesParallel,
} from 'src/common/helper';
import { PassengerManifestTemplate } from '../templates/passenger-manifest';
import { BoardingPassService } from 'src/ops/services/boarding-pass.service';
import { TripDetailService } from 'src/ops/services/trip-detail.service';

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

  private readonly airOpsLogo: string;
  private readonly cloudFrontUrl: string;
  constructor(
    private readonly config: ConfigService,
    private readonly quoteService: QuotesService,
    private readonly invoiceService: InvoiceService,
    private readonly boardingPassService: BoardingPassService,
    private readonly tripDetailService: TripDetailService,
  ) {
    this.airOpsLogo = this.config.get<string>('logo');
    this.cloudFrontUrl = this.config.get<string>('s3.aws_cloudfront_base_url');
  }

  async sendEmail(
    to: string | string[],
    subject: string,
    text: string,
    html?: string,
    attachments?: any,
    cc?: string | string[],
  ) {
    try {
      const result = await this.transporter.sendMail({
        from: `"Airops" <${process.env.EMAIL_USER}>`, // Custom sender name
        to,
        cc,
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

  // async createPDF(filePath: string, htmlContent: string): Promise<string> {
  //   const isLocal = true;

  //   const browser = await puppeteer.launch({
  //     headless: true, // Use `true` instead of `"new"`
  //     args: isLocal
  //       ? []
  //       : [
  //           '--no-sandbox',
  //           '--disable-setuid-sandbox',
  //           '--disable-dev-shm-usage',
  //           '--disable-gpu',
  //           '--single-process',
  //         ],
  //   });

  //   const page = await browser.newPage();
  //   await page.setContent(htmlContent);
  //   // ✅ Alternative to waitForTimeout
  //   // await page.waitForFunction(() => document.readyState === 'complete');

  //   await page.pdf({ path: filePath, format: 'A4' });

  //   await browser.close();
  //   return filePath;
  // }

  // async createPDF(filePath: string, htmlContent: string): Promise<string> {
  //   const isLocal = process.env.NODE_ENV !== 'production'; // <--- Auto detect!

  //   const browser = await puppeteer.launch({
  //     headless: true,
  //     args: isLocal
  //       ? []
  //       : [
  //           '--no-sandbox',
  //           '--disable-setuid-sandbox',
  //           '--disable-dev-shm-usage',
  //           '--disable-gpu',
  //           '--single-process',
  //         ],
  //   });

  //   const page = await browser.newPage();
  //   await page.setContent(htmlContent, { waitUntil: 'networkidle0' }); // better
  //   await page.pdf({ path: filePath, format: 'A4' });

  //   await browser.close();
  //   return filePath;
  // }

  // async sendAcknowledgement(args) {
  //   const { quotationNo, email, documentType } = args;
  //   if (!documentType)
  //     throw new BadRequestException('documentType is required');

  //   const quote = await this.quoteService.getQuoteById(quotationNo);
  //   if (!quote) throw new BadRequestException('No Quote Found');

  //   let htmlContent;

  //   let filePath = 'salesDoc.pdf',
  //     subject = '',
  //     text = '';

  //   const to = email || quote?.client?.email;

  //   if (documentType == SalesDocumentType.QUOTATION) {
  //     htmlContent = QuotePdfTemplate(quote);
  //     filePath = 'quote.pdf';

  //     subject = `Your Flight Quote - Reference No. ${quote?.revisedQuotationNo || quote?.quotationNo} `;
  //     text = `We are Pleased to offer to you the ${quote?.aircraftDetail?.name}`;
  //   }

  //   if (
  //     documentType == SalesDocumentType.PROFORMA_INVOICE ||
  //     documentType == SalesDocumentType.TAX_INVOICE
  //   ) {
  //     // htmlContent = InvoiceTemplate(quote);
  //     const [invoice] = await this.invoiceService.query({
  //       filter: {
  //         quotationNo: { eq: quotationNo },
  //         type: { eq: documentType },
  //       },
  //     });
  //     if (!invoice) throw new BadRequestException('No Invoice Found');
  //     const referenceNo =
  //       documentType == SalesDocumentType.PROFORMA_INVOICE
  //         ? invoice?.proformaInvoiceNo
  //         : invoice?.taxInvoiceNo;
  //     htmlContent = invoice.template;
  //     subject = `Your Flight Invoice - Reference No. ${referenceNo} `;
  //     filePath = 'invoice.pdf';
  //   }
  //   if (documentType == SalesDocumentType.SALE_CONFIRMATION) {
  //     htmlContent = SaleConfirmationTemplate(quote);
  //     subject = `Your Flight Sales Confirmation - Reference No. ${quotationNo} `;
  //     filePath = 'invoice.pdf';
  //   }

  //   const pdfPath = await createPDF(filePath, htmlContent);

  //   const attachments = [{ filename: 'document.pdf', path: pdfPath }];

  //   await this.sendEmail(to, subject, text, null, attachments);

  //   return 'PDF sent successfully!';
  // }

  async sendAcknowledgement(args: {
    quotationNo: string;
    email?: string;
    documentType: SalesDocumentType;
    tripId?: string;
    sectorNo?: number;
  }) {
    const { quotationNo, email, documentType } = args;

    if (!documentType)
      throw new BadRequestException('documentType is required');

    let quote: any;
    if (quotationNo && quotationNo !== 'undefined' && quotationNo !== '' && documentType != SalesDocumentType.TRIP_CONFIRMATION) {
      quote = await this.quoteService.getQuoteByQuotatioNo(quotationNo);
    }

    const to = email || quote?.client?.email;
    // if (!to) throw new BadRequestException('Recipient email not found'); // Move this down as we might get email from trip

    const logoUrl = quote?.operator
      ? `${this.cloudFrontUrl}${quote?.operator?.companyLogo}`
      : this.airOpsLogo;

    let htmlContent: string;
    let subject = '';
    let text = '';
    let defaultFileName = 'document.pdf';

    // Determine content based on documentType
    switch (documentType) {
      case SalesDocumentType.QUOTATION:
        htmlContent = QuotePdfTemplate({ ...quote, logoUrl, cloudFrontUrl: this.cloudFrontUrl });
        subject = `Your Flight Quote - Reference No. ${quote.revisedQuotationNo || quote.quotationNo}`;
        text = `We are pleased to offer you the ${quote.aircraftDetail?.name}`;
        defaultFileName = `quote-${quote.quotationNo}.pdf`;
        break;

      case SalesDocumentType.PROFORMA_INVOICE:
      case SalesDocumentType.TAX_INVOICE: {
        const [invoice] = await this.invoiceService.query({
          filter: {
            quotationNo: { eq: quotationNo },
            type: { eq: documentType },
          },
        });
        if (!invoice) throw new BadRequestException('No Invoice Found');

        const referenceNo =
          documentType === SalesDocumentType.PROFORMA_INVOICE
            ? invoice.proformaInvoiceNo
            : invoice.taxInvoiceNo;

        htmlContent = invoice.template;
        subject = `Your Flight Invoice - Reference No. ${referenceNo}`;
        defaultFileName = `invoice-${referenceNo}.pdf`;
        break;
      }

      case SalesDocumentType.SALE_CONFIRMATION:
        htmlContent = SaleConfirmationTemplate({ ...quote, logoUrl });
        subject = `Your Flight Sales Confirmation - Reference No. ${quotationNo}`;
        defaultFileName = `sales-confirmation-${quotationNo}.pdf`;
        break;

      case SalesDocumentType.BOARDING_PASS:
        if (!args.tripId || !args.sectorNo) {
          throw new BadRequestException('tripId and sectorNo are required for Boarding Pass');
        }
        if (!to) throw new BadRequestException('Recipient email not found');
        htmlContent = await this.boardingPassService.generateBoardingPassHtml(args.tripId, Number(args.sectorNo));
        subject = `Boarding Passes - Trip ${args.tripId} Sector ${args.sectorNo}`;
        defaultFileName = `boarding-passes-${args.tripId}-${args.sectorNo}.pdf`;
        break;

      case SalesDocumentType.TRIP_CONFIRMATION:
        if (!args.tripId) {
          throw new BadRequestException('tripId is required for Trip Confirmation');
        }
        htmlContent = await this.tripDetailService.tripConfirmationPreview(args.tripId);
        if (!htmlContent) throw new BadRequestException('No Trip Confirmation Found');
        subject = `Trip Confirmation - Trip ${args.tripId}`;
        defaultFileName = `trip-confirmation-${args.tripId.replace(/\//g, '-')}.pdf`;
        if (!to) {
          // If no email provided, we might want to get it from the trip/quote if possible
          // But for now, let's keep it required or try to find it
          throw new BadRequestException('Recipient email is required for Trip Confirmation');
        }
        break;

      default:
        throw new BadRequestException('Unsupported document type');
    }

    // ✅ Inline images in parallel for faster PDF generation
    htmlContent = await inlineImagesParallel(htmlContent);

    const pdfOptions: any = {};
    if (documentType === SalesDocumentType.BOARDING_PASS) {
      pdfOptions.landscape = true;
      pdfOptions.printBackground = true;
      pdfOptions.margin = {
        top: '20mm',
        bottom: '20mm',
        left: '10mm',
        right: '10mm'
      };
    }

    // ✅ Generate PDF as Buffer (includes inline images)
    const pdfBuffer = await createPDFBuffer(htmlContent, pdfOptions);

    // ✅ Prepare attachments (Buffer instead of path)
    const attachments = [
      {
        filename: defaultFileName,
        content: pdfBuffer, // 👈 Nodemailer accepts Buffer here
      },
    ];

    // ✅ Send email
    await this.sendEmail(to, subject, text, null, attachments);

    return 'PDF sent successfully!';
  }
}
