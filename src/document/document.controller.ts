import {
  BadRequestException,
  Controller,
  Get,
  Param,
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

@Controller('api/document')
export class DocumentController {
  private baseUrl: string;
  constructor(
    private readonly quotesService: QuotesService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('site_url');
  }

  //   @Get('quote/download/:quotationNo')
  //   async downloadQuotePdf(
  //     @Param('quotationNo') quotationNo: string,
  //     @Res({ passthrough: true }) res: Response,
  //   ): Promise<StreamableFile> {
  //     const quote = await this.quotesService.getQuoteByQuotatioNo(quotationNo);
  //     if (!quote) {
  //       throw new BadRequestException('No Quote Found for the given number');
  //     }

  //     const htmlContent = QuotePdfTemplate(quote);

  //     // Sanitize the quotationNo to use in the filename
  //     const sanitizedQuotationNo = quotationNo.replace(/\//g, '-');

  //     // Create a temporary file path
  //     const filePath = join(
  //       process.cwd(),
  //       `quote-${sanitizedQuotationNo}-${Date.now()}.pdf`,
  //     );

  //     try {
  //       // Create the PDF using your existing logic
  //       await createPDv1F(filePath, htmlContent);

  //       // Read the PDF file to stream it back
  //       const file = await readFile(filePath);

  //       // Set headers for file download
  //       res.header({
  //         'Content-Type': 'application/pdf',
  //         'Content-Disposition': `attachment; filename="quote-${quotationNo}.pdf"`,
  //       });

  //       // Return the file as a streamable file
  //       return new StreamableFile(file);
  //     } catch (error) {
  //       // Log the error and re-throw
  //       console.error('Failed to generate or stream PDF:', error);
  //       throw new BadRequestException('Failed to generate PDF');
  //     }
  //   }

  @Get('quote/downloadv1/:quotationNo')
  async downloadQuotePdfv1(
    @Param('quotationNo') quotationNo: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const quote = await this.quotesService.getQuoteByQuotatioNo(quotationNo);
    if (!quote) {
      throw new BadRequestException('No Quote Found for the given number');
    }

    const logoUrl = quote?.operator
      ? `${this.baseUrl}${quote?.operator?.companyLogo}`
      : `${this.baseUrl}media/profile/logo_phn-1752924866468-198955892.png`;

    const htmlContent = QuotePdfTemplate({ ...quote, logoUrl });

    // Sanitize the quotationNo to use in the filename
    const sanitizedQuotationNo = quotationNo.replace(/\//g, '-');

    try {
      // ✅ Directly create PDF as Buffer
      const pdfBuffer = await createPDFv1(htmlContent);

      // ✅ Set headers for file download
      res.header({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quote-${sanitizedQuotationNo}.pdf"`,
      });

      // ✅ Return StreamableFile from Buffer
      return new StreamableFile(pdfBuffer);
    } catch (error) {
      console.error('Failed to generate or stream PDF:', error);
      throw new BadRequestException('Failed to generate PDF');
    }
  }

  @Get('quote/download/:quotationNo')
  async downloadQuotePdf(
    @Param('quotationNo') quotationNo: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const quote = await this.quotesService.getQuoteByQuotatioNo(quotationNo);
    if (!quote) {
      throw new BadRequestException('No Quote Found for the given number');
    }

    const logoUrl = quote?.operator
      ? `${this.baseUrl}${quote?.operator?.companyLogo}`
      : `${this.baseUrl}media/profile/logo_phn-1752924866468-198955892.png`;

    let htmlContent = QuotePdfTemplate({ ...quote, logoUrl });

    // ✅ Inline all images in parallel with caching
    htmlContent = await inlineImagesParallel(htmlContent);

    const sanitizedQuotationNo = quotationNo.replace(/\//g, '-');

    try {
      const pdfBuffer = await createPDFv1(htmlContent); // generate PDF buffer

      // ✅ Set headers for download
      res.header({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quote-${sanitizedQuotationNo}.pdf"`,
      });

      return new StreamableFile(pdfBuffer);
    } catch (error) {
      console.error('Failed to generate or stream PDF:', error);
      throw new BadRequestException('Failed to generate PDF');
    }
  }
}
