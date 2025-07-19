import { MongooseQueryService } from '@app/query-mongoose';
import { InvoiceEntity } from '../entities/invoice.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter } from '../entities/counter.entity';
import { QuotesService } from './quotes.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InvoiceTemplate } from 'src/notification/templates/invoice.template';
import { CounterType, InvoiceType, QuoteStatus } from 'src/app-constants/enums';
import { ConfigService } from '@nestjs/config';

export class InvoiceService extends MongooseQueryService<InvoiceEntity> {
  private baseUrl: string;
  constructor(
    @InjectModel(InvoiceEntity.name) model: Model<InvoiceEntity>,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
    private readonly quoteService: QuotesService,
    private readonly config: ConfigService,
  ) {
    super(model);
    this.baseUrl = this.config.get<string>('site_url');
  }

  async generateInvoice(args) {
    const { id, quotationNo, proformaInvoiceNo, type } = args;

    const quote = await this.quoteService.getQuoteById(quotationNo);
    if (!quote) throw new BadRequestException('No Quote Found');

    if (type === InvoiceType.PROFORMA_INVOICE) {
      const invoice = await this.query({
        filter: { quotationNo: { eq: quotationNo } },
      });

      if (invoice.length)
        throw new Error(
          `Performance is already generated Quote:${quotationNo}`,
        );

      const invoiceNo = await this.generateProformaInvoiceNumber();

      let htmlContent = InvoiceTemplate({
        ...quote,
        invoiceNo,
        type: InvoiceType.PROFORMA_INVOICE,
        logoUrl: quote?.operator
          ? `${this.baseUrl}${quote?.operator?.companyLogo}`
          : `${this.baseUrl}media/profile/logo_phn-1752924866468-198955892.png`,
      });
      if (!htmlContent) throw new BadRequestException('No Content Found');

      const created = await this.createOne({
        quotation: quote._id,
        quotationNo: quote.quotationNo,
        proformaInvoiceNo: invoiceNo,
        isLatest: true,
        type: InvoiceType.PROFORMA_INVOICE,
        template: htmlContent,
        status: QuoteStatus.PROFOMA_INVOICE,
      });

      if (!created)
        throw new InternalServerErrorException('Error in creating invoice');

      return created;
    }
    if (type === InvoiceType.TAX_INVOICE) {
      const [taxInvoice] = await this.query({
        // filter: { proformaInvoiceNo: { eq: proformaInvoiceNo } },
        filter: {
          quotationNo: { eq: quotationNo },
          ...(proformaInvoiceNo
            ? { proformaInvoiceNo: { eq: proformaInvoiceNo } }
            : {}),
          type: { eq: InvoiceType.TAX_INVOICE },
        },
      });

      if (taxInvoice)
        throw new Error(
          `Tax Invoice is already generated For this Quote:${quotationNo}`,
        );

      const [invoice] = await this.query({
        // filter: { proformaInvoiceNo: { eq: proformaInvoiceNo } },
        filter: {
          quotationNo: { eq: quotationNo },
          ...(proformaInvoiceNo
            ? { proformaInvoiceNo: { eq: proformaInvoiceNo } }
            : {}),
        },
      });

      if (!invoice) throw new Error('no invoice found');

      if (invoice.status !== QuoteStatus.PROFOMA_INVOICE)
        throw new Error(
          `Proforma Invoice is not generated For this Quote:${invoice.quotationNo}`,
        );

      const quote = await this.quoteService.getQuoteById(invoice?.quotationNo);
      if (!quote) throw new BadRequestException('No Quote Found');

      if (quote.status !== QuoteStatus.SALE_CONFIRMED)
        throw new BadRequestException('Quote is not confirmed');

      const invoiceNo = await this.generateTaxInvoiceNumber();

      let htmlContent = InvoiceTemplate({
        ...quote,
        invoiceNo,
        type: InvoiceType.TAX_INVOICE,
      });
      if (!htmlContent)
        throw new BadRequestException('Failed to generate invoice');

      const created = await this.createOne({
        quotation: quote._id,
        proformaInvoiceNo: invoice.proformaInvoiceNo,
        quotationNo: quote.quotationNo,
        taxInvoiceNo: invoiceNo,
        isLatest: true,
        type: InvoiceType.TAX_INVOICE,
        template: htmlContent,
        status: QuoteStatus.TAX_INVOICE,
      });
      if (!created)
        throw new InternalServerErrorException('Error in creating invoice');

      return created;
    }
  }

  async generateProformaInvoiceNumber(): Promise<string> {
    // const currentYear = new Date().getFullYear() % 100; // Get last two digits of the year

    // const counter = await this.counterModel.findOneAndUpdate(
    //   { year: currentYear, type: CounterType.proformaInvoice },
    //   { $inc: { serial: 1 } },
    //   { new: true, upsert: true },
    // );

    // const serialNumber = counter.serial.toString().padStart(4, '0'); // Format serial to 4 digits
    // return `AOPI/${currentYear}/${serialNumber}`;

    const now = new Date();
    const currentYear = now.getFullYear() % 100; // Last two digits of the year

    const pad = (n: number) => n.toString().padStart(2, '0');

    const dateTimePart = `${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`;

    const invoiceNo = `AOPI/${currentYear}/${dateTimePart}`;
    return invoiceNo;
  }

  async generateTaxInvoiceNumber(): Promise<string> {
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // Last two digits of the year

    const fyStart = new Date().getFullYear() % 100; // e.g., 2025 => 25
    const fyEnd = (fyStart + 1) % 100;
    // 26
    const counter = await this.counterModel.findOneAndUpdate(
      { year: currentYear, type: CounterType.taxInvoice },
      { $inc: { serial: 1 } },
      { new: true, upsert: true },
    );

    const serialNumber = counter.serial.toString().padStart(2, '0');

    return `AO${fyStart}-${fyEnd}/INV/${serialNumber}`;
  }

  // async previewInvoice(args) {
  //   const { id, invoiceNo, type } = args;

  //   const invoice = await this.query({
  //     filter: { invoiceNo: invoiceNo, type: type },
  //   });

  //   if (!invoice.length) throw new BadRequestException('No Invoice Found');

  //   const quote = await this.quoteService.getQuoteById(
  //     invoice?.[0]?.quotationNo,
  //   );
  //   if (!quote) throw new BadRequestException('No Quote Found');

  //   let htmlContent = InvoiceTemplate(quote);
  //   if (!htmlContent) throw new BadRequestException('No Content Found');
  //   return htmlContent;
  // }
}
