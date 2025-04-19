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
import { SortDirection } from '@app/core';
import { CounterType, InvoiceType, QuoteStatus } from 'src/app-constants/enums';

export class InvoiceService extends MongooseQueryService<InvoiceEntity> {
  constructor(
    @InjectModel(InvoiceEntity.name) model: Model<InvoiceEntity>,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
    private readonly quoteService: QuotesService,
  ) {
    super(model);
  }

  async generateInvoice(args) {
    const { id, quotationNo, isRevised } = args;

    const quote = await this.quoteService.getQuoteById(quotationNo);
    if (!quote) throw new BadRequestException('No Quote Found');

    let proformaInvoiceNo = quote.proformaInvoiceNo ?? '';
    if (!isRevised) {
      const invoiceNo = await this.generateProformaInvoiceNumber();
      proformaInvoiceNo = invoiceNo;
      const created = await this.createOne({
        quotation: quote._id,
        quotationNo: quote.quotationNo,
        invoiceNo,
        isLatest: true,
        type: InvoiceType.PROFORMA_INVOICE,
      });

      if (!created)
        throw new InternalServerErrorException('Error in creating invoice');
    } else {
      const [invoice] = await this.query({
        filter: { quotationNo: quotationNo },
        paging: { limit: 1 },
        sorting: [{ field: 'id', direction: SortDirection.DESC }],
      });

      invoice.revision += 1;
      const originalInvoiceNo = invoice.invoiceNo.split('/R')[0];
      invoice.invoiceNo = `${originalInvoiceNo}/R${invoice.revision}`;

      const created = await this.createOne(invoice);
      if (!created)
        throw new InternalServerErrorException('Error in creating invoice');

      await this.updateOne(invoice._id.toString(), {
        isLatest: false,
      });
    }

    //update quotation status

    await this.quoteService.updateOne(quote._id.toString(), {
      status: QuoteStatus.PROFOMA_INVOICE,
      proformaInvoiceNo,
    });

    quote.proformaInvoiceNo = proformaInvoiceNo;
    let htmlContent = InvoiceTemplate(quote);
    if (!htmlContent) throw new BadRequestException('No Content Found');

    return htmlContent;
  }

  async generateProformaInvoiceNumber(): Promise<string> {
    const currentYear = new Date().getFullYear() % 100; // Get last two digits of the year

    const counter = await this.counterModel.findOneAndUpdate(
      { year: currentYear, type: CounterType.proformaInvoice },
      { $inc: { serial: 1 } },
      { new: true, upsert: true },
    );

    const serialNumber = counter.serial.toString().padStart(4, '0'); // Format serial to 4 digits
    return `AOPI/${currentYear}/${serialNumber}`;
  }
}
