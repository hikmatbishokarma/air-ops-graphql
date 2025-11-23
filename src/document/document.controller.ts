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
import { SalesDocumentType } from 'src/app-constants/enums';
import { PassengerDetailService } from 'src/passenger-detail/services/passenger-detail.service';
import { TripDetailService } from 'src/ops/services/trip-detail.service';

@Controller('api/document')
export class DocumentController {
  private apiUrl: string;
  private airOpsLogo: string;
  constructor(
    private readonly quotesService: QuotesService,
    private readonly config: ConfigService,
    private readonly invoiceService: InvoiceService,
    private readonly passengerDetailService: PassengerDetailService,
    private readonly tripDetailService: TripDetailService,
  ) {
    this.apiUrl = this.config.get<string>('api_url');
    this.airOpsLogo = this.config.get<string>('logo');
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
  //       ? `${this.apiUrl}${quote?.operator?.companyLogo}`
  //       : `${this.apiUrl}media/profile/logo_phn-1752924866468-198955892.png`;

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
  //       ? `${this.apiUrl}${quote?.operator?.companyLogo}`
  //       : `${this.apiUrl}media/profile/logo_phn-1752924866468-198955892.png`;

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
    @Query('documentType') documentType: SalesDocumentType, // e.g., 'QUOTE', 'PROFORMA_INVOICE'
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    if (!quotationNo) throw new BadRequestException('quotationNo is required');
    if (!documentType)
      throw new BadRequestException('documentType is required');

    const quote = await this.quotesService.getQuoteByQuotatioNo(quotationNo);
    if (!quote) throw new BadRequestException('No Quote Found');

    const logoUrl = quote?.operator
      ? `${this.apiUrl}${quote?.operator?.companyLogo}`
      : this.airOpsLogo;

    let htmlContent: string;
    let defaultFileName = '';

    // Decide template and file name based on documentType
    switch (documentType) {
      case SalesDocumentType.QUOTATION:
        htmlContent = QuotePdfTemplate({
          ...quote,
          logoUrl,
          apiUrl: this.apiUrl,
        });
        defaultFileName = `quote-${quotationNo.replace(/\//g, '-')}.pdf`;
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
        htmlContent = invoice.template;
        const referenceNo =
          documentType === SalesDocumentType.PROFORMA_INVOICE
            ? invoice.proformaInvoiceNo
            : invoice.taxInvoiceNo;
        defaultFileName = `invoice-${referenceNo}.pdf`;
        break;
      }

      case SalesDocumentType.SALE_CONFIRMATION:
        const [passengerInfo] = await this.passengerDetailService.query({
          filter: {
            quotation: { eq: quote._id },
            quotationNo: { eq: quote.quotationNo },
          },
        });

        htmlContent = SaleConfirmationTemplate({ ...quote, passengerInfo });
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

  @Get('manifest/download')
  async downloadPassengerManifest(
    @Query('tripId') tripId: string,
    @Query('sectorNo') sectorNo: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {


    if (!tripId) throw new BadRequestException('tripId is required');
    if (!sectorNo) throw new BadRequestException('sectorNo is required');

    // Convert sectorNo from string to number
    const sectorNumber = parseInt(sectorNo, 10);
    if (isNaN(sectorNumber)) {
      throw new BadRequestException('sectorNo must be a valid number');
    }

    const passengerManifest = await this.tripDetailService.generatePassengerManifest({
      tripId,
      sectorNo: sectorNumber
    });
    if (!passengerManifest) throw new BadRequestException('No Passenger Manifest Found');


    let htmlContent: string;
    let defaultFileName = `passenger-manifest-${tripId.replace(/\//g, '-')}.pdf`;

    // // Decide template and file name based on documentType
    // switch (documentType) {
    //   case SalesDocumentType.QUOTATION:
    //     htmlContent = QuotePdfTemplate({
    //       ...quote,
    //       logoUrl,
    //       apiUrl: this.apiUrl,
    //     });
    //     defaultFileName = `quote-${quotationNo.replace(/\//g, '-')}.pdf`;
    //     break;

    //   case SalesDocumentType.PROFORMA_INVOICE:
    //   case SalesDocumentType.TAX_INVOICE: {
    //     const [invoice] = await this.invoiceService.query({
    //       filter: {
    //         quotationNo: { eq: quotationNo },
    //         type: { eq: documentType },
    //       },
    //     });
    //     if (!invoice) throw new BadRequestException('No Invoice Found');
    //     htmlContent = invoice.template;
    //     const referenceNo =
    //       documentType === SalesDocumentType.PROFORMA_INVOICE
    //         ? invoice.proformaInvoiceNo
    //         : invoice.taxInvoiceNo;
    //     defaultFileName = `invoice-${referenceNo}.pdf`;
    //     break;
    //   }

    //   case SalesDocumentType.SALE_CONFIRMATION:
    //     const [passengerInfo] = await this.passengerDetailService.query({
    //       filter: {
    //         quotation: { eq: quote._id },
    //         quotationNo: { eq: quote.quotationNo },
    //       },
    //     });

    //     htmlContent = SaleConfirmationTemplate({ ...quote, passengerInfo });
    //     defaultFileName = `sales-confirmation-${quotationNo.replace(/\//g, '-')}.pdf`;
    //     break;

    //   default:
    //     throw new BadRequestException('Unsupported document type');
    // }

    // Inline images and generate PDF
    htmlContent = await inlineImagesParallel(passengerManifest);
    const pdfBuffer = await createPDFv1(htmlContent);

    // Set headers and return PDF
    res.header({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${defaultFileName}"`,
    });

    return new StreamableFile(pdfBuffer);
  }


}
