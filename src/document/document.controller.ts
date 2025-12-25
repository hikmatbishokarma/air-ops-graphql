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
import { QuotePdfTemplate } from 'src/notification/templates/quote.template';
import { QuotesService } from 'src/quotes/services/quotes.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { InvoiceService } from 'src/quotes/services/invoice.service';
import { SaleConfirmationTemplate } from 'src/notification/templates/sale-confirmation';
import { SalesDocumentType } from 'src/app-constants/enums';
import { PassengerDetailService } from 'src/passenger-detail/services/passenger-detail.service';
import { TripDetailService } from 'src/ops/services/trip-detail.service';
import { BoardingPassService } from 'src/ops/services/boarding-pass.service';

@Controller('api/document')
export class DocumentController {
  private apiUrl: string;
  private airOpsLogo: string;
  private cloudFrontUrl: string;
  constructor(
    private readonly quotesService: QuotesService,
    private readonly config: ConfigService,
    private readonly invoiceService: InvoiceService,
    private readonly passengerDetailService: PassengerDetailService,
    private readonly tripDetailService: TripDetailService,
    private readonly boardingPassService: BoardingPassService,
  ) {
    this.apiUrl = this.config.get<string>('api_url');
    this.airOpsLogo = this.config.get<string>('logo');
    this.cloudFrontUrl = this.config.get<string>('s3.aws_cloudfront_base_url');
  }



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
      ? `${this.cloudFrontUrl}${quote?.operator?.companyLogo}`
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
          cloudFrontUrl: this.cloudFrontUrl,
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

        htmlContent = SaleConfirmationTemplate({ ...quote, passengerInfo, logoUrl });
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

  @Get('boarding-pass/download')
  async downloadBoardingPass(
    @Query('tripId') tripId: string,
    @Query('sectorNo') sectorNo: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    if (!tripId) throw new BadRequestException('tripId is required');
    if (!sectorNo) throw new BadRequestException('sectorNo is required');

    const htmlContent = await this.boardingPassService.generateBoardingPassHtml(tripId, Number(sectorNo));
    const pdfBuffer = await createPDFv1(htmlContent, {
      landscape: true,
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '10mm',
        right: '10mm'
      }
    });

    res.header({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="boarding-passes-${tripId}-sector-${sectorNo}.pdf"`,
    });

    return new StreamableFile(pdfBuffer);
  }
}
