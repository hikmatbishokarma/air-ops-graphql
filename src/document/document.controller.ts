import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { createPDFv1, inlineImagesParallel } from 'src/common/helper';
import { QuotePdfTemplate } from 'src/notification/templates/email.template';
import { QuotesService } from 'src/quotes/services/quotes.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { InvoiceService } from 'src/quotes/services/invoice.service';
import { SaleConfirmationTemplate } from 'src/notification/templates/sale-confirmation';

@Controller('api/document')
export class DocumentController {
  private baseUrl: string;
  constructor(
    private readonly quotesService: QuotesService,
    private readonly config: ConfigService,
    private readonly invoiceService: InvoiceService,
  ) {
    this.baseUrl = this.config.get<string>('site_url');
  }

  //   @Get('quote/downloadv1/:quotationNo')
  //   async downloadQuotePdfv1(
  //     @Param('quotationNo') quotationNo: string,
  //     @Res({ passthrough: true }) res: Response,
  //   ): Promise<StreamableFile> {
  //     const quote = await this.quotesService.getQuoteByQuotatioNo(quotationNo);
  //     if (!quote) {
  //       throw new BadRequestException('No Quote Found for the given number');
  //     }

  //     const logoUrl = quote?.operator
  //       ? `${this.baseUrl}${quote?.operator?.companyLogo}`
  //       : `${this.baseUrl}media/profile/logo_phn-1752924866468-198955892.png`;

  //     const htmlContent = QuotePdfTemplate({ ...quote, logoUrl });

  //     // Sanitize the quotationNo to use in the filename
  //     const sanitizedQuotationNo = quotationNo.replace(/\//g, '-');

  //     try {
  //       // ✅ Directly create PDF as Buffer
  //       const pdfBuffer = await createPDFv1(htmlContent);

  //       // ✅ Set headers for file download
  //       res.header({
  //         'Content-Type': 'application/pdf',
  //         'Content-Disposition': `attachment; filename="quote-${sanitizedQuotationNo}.pdf"`,
  //       });

  //       // ✅ Return StreamableFile from Buffer
  //       return new StreamableFile(pdfBuffer);
  //     } catch (error) {
  //       console.error('Failed to generate or stream PDF:', error);
  //       throw new BadRequestException('Failed to generate PDF');
  //     }
  //   }

  //   @Get('quote/download/:quotationNo')
  //   async downloadQuotePdf(
  //     @Param('quotationNo') quotationNo: string,
  //     @Res({ passthrough: true }) res: Response,
  //   ): Promise<StreamableFile> {
  //     const quote = await this.quotesService.getQuoteByQuotatioNo(quotationNo);
  //     if (!quote) {
  //       throw new BadRequestException('No Quote Found for the given number');
  //     }

  //     const logoUrl = quote?.operator
  //       ? `${this.baseUrl}${quote?.operator?.companyLogo}`
  //       : `${this.baseUrl}media/profile/logo_phn-1752924866468-198955892.png`;

  //     let htmlContent = QuotePdfTemplate({ ...quote, logoUrl });

  //     // ✅ Inline all images in parallel with caching
  //     htmlContent = await inlineImagesParallel(htmlContent);

  //     const sanitizedQuotationNo = quotationNo.replace(/\//g, '-');

  //     try {
  //       const pdfBuffer = await createPDFv1(htmlContent); // generate PDF buffer

  //       // ✅ Set headers for download
  //       res.header({
  //         'Content-Type': 'application/pdf',
  //         'Content-Disposition': `attachment; filename="quote-${sanitizedQuotationNo}.pdf"`,
  //       });

  //       return new StreamableFile(pdfBuffer);
  //     } catch (error) {
  //       console.error('Failed to generate or stream PDF:', error);
  //       throw new BadRequestException('Failed to generate PDF');
  //     }
  //   }

  @Get('quote/download')
  async downloadDocument(
    @Query('quotationNo') quotationNo: string,
    @Query('documentType') documentType: string, // e.g., 'QUOTE', 'PROFORMA_INVOICE'
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    if (!quotationNo) throw new BadRequestException('quotationNo is required');
    if (!documentType)
      throw new BadRequestException('documentType is required');

    const quote = await this.quotesService.getQuoteByQuotatioNo(quotationNo);
    if (!quote) throw new BadRequestException('No Quote Found');

    const logoUrl = quote?.operator
      ? `${this.baseUrl}${quote?.operator?.companyLogo}`
      : `${this.baseUrl}media/profile/logo_phn-1752924866468-198955892.png`;

    let htmlContent: string;
    let defaultFileName = '';

    // Decide template and file name based on documentType
    switch (documentType) {
      case 'QUOTE':
        htmlContent = QuotePdfTemplate({ ...quote, logoUrl });
        defaultFileName = `quote-${quotationNo.replace(/\//g, '-')}.pdf`;
        break;

      case 'PROFORMA_INVOICE':
      case 'TAX_INVOICE': {
        const [invoice] = await this.invoiceService.query({
          filter: {
            quotationNo: { eq: quotationNo },
            type: { eq: documentType },
          },
        });
        if (!invoice) throw new BadRequestException('No Invoice Found');
        htmlContent = invoice.template;
        const referenceNo =
          documentType === 'PROFORMA_INVOICE'
            ? invoice.proformaInvoiceNo
            : invoice.taxInvoiceNo;
        defaultFileName = `invoice-${referenceNo}.pdf`;
        break;
      }

      case 'SALE_CONFIRMATION':
        htmlContent = SaleConfirmationTemplate(quote);
        defaultFileName = `sales-confirmation-${quotationNo.replace(/\//g, '-')}.pdf`;
        break;

      default:
        throw new BadRequestException('Unsupported document type');
    }

    // Inline images and generate PDF
    htmlContent = await inlineImagesParallel(htmlContent);
    const pdfBuffer = await createPDFv1(htmlContent);

    // Set headers and return PDF
    res.header({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${defaultFileName}"`,
    });

    return new StreamableFile(pdfBuffer);
  }
}
