import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { MongooseQueryService } from '@app/query-mongoose';
import { QuotesEntity } from '../entities/quotes.entity';
import { AirportsService } from 'src/airports/services/airports.service';
import { AircraftDetailService } from 'src/aircraft-detail/services/aircraft-detail.service';
import {
  CounterType,
  QuoteStatus,
  SalesDocumentType,
  TemplateType,
} from 'src/app-constants/enums';
import { DeepPartial } from '@app/core';
import { QuotePdfTemplate } from 'src/notification/templates/email.template';
import { Counter } from '../entities/counter.entity';
import { QuotationTemplateEntity } from '../entities/quote-template.entity';
import { InvoiceTemplate } from 'src/notification/templates/invoice.template';
import { calculateDuration } from 'src/common/helper';

const { QUOTE, TAX_INVOICE, PROFOMA_INVOICE, CANCELLED } = QuoteStatus;
const quotationWorkflowTransition = {
  Quote: [CANCELLED, TAX_INVOICE, PROFOMA_INVOICE],
};

@Injectable()
export class QuotesService extends MongooseQueryService<QuotesEntity> {
  constructor(
    @InjectModel(QuotesEntity.name) model: Model<QuotesEntity>,
    private readonly airportService: AirportsService,
    private readonly aircraftService: AircraftDetailService,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
    @InjectModel(QuotationTemplateEntity.name)
    private quotationTemplate: Model<QuotationTemplateEntity>,
  ) {
    super(model);
  }

  async RequestedQuoteList() {
    const result = await this.query({});

    if (result.length == 0) {
      return [];
    }

    for (let i = 0; i < result.length; i++) {
      const quote = result[i];

      const airportcodes = Array.from(
        new Set(
          quote.itinerary.flatMap((segment: any) => [
            segment.source,
            segment.destination,
          ]),
        ),
      );
      const quoteSegments = await this.airportService.query({
        filter: { iata_code: { in: airportcodes } },
        projection: { _id: 0, createdAt: 0, updatedAt: 0, isActive: 0 },
      });

      quote.itinerary.forEach((segment: any) => {
        const source = quoteSegments.find(
          (s: any) => s.iata_code === segment.source,
        );
        const destination = quoteSegments.find(
          (s: any) => s.iata_code === segment.destination,
        );
        segment.source = source;
        segment.destination = destination;
      });
    }

    return result;
  }

  async updateQuotationStatus(id: string, state: QuoteStatus) {
    const quotation = await this.findById(id);
    if (!quotation) {
      throw new BadRequestException('Quotation not found');
    }

    if (!this.isValidTransition(quotation.status, state)) {
      throw new BadRequestException(
        `Invalid state transition from ${quotation.status} to ${state}`,
      );
    }

    const updatedQuotation = await this.updateOne(id, { status: state });
    return updatedQuotation;
  }

  async upgrade(code: string) {
    const [quotation] = await this.query({
      filter: {
        code: { eq: code },
        status: { eq: QuoteStatus.QUOTE },
      },
    });
    if (!quotation) {
      throw new BadRequestException('No Quot version exists');
    }

    const clonedQuotation: DeepPartial<QuotesEntity> = {
      ...quotation.toObject(),
    };

    const originalQuotation = clonedQuotation.quotationNo.split('/R')[0];
    clonedQuotation.version += 1;
    clonedQuotation.revision += 1;
    clonedQuotation.status = QuoteStatus.QUOTE;
    clonedQuotation.quotationNo = `${originalQuotation}/R${clonedQuotation.revision}`;
    delete clonedQuotation._id;

    const created = await this.createOne(clonedQuotation);

    // update status to deprecated for previous quote

    await this.updateOne(quotation._id.toString(), {
      isLatest: false,
      status: QuoteStatus.DEPRECATED,
    });
    return created;
  }

  private isValidTransition(
    currentState: QuoteStatus,
    newState: QuoteStatus,
  ): boolean {
    return quotationWorkflowTransition[currentState].includes(newState);
  }

  async getQuoteById(quotationNo = null) {
    //const [quote] = await this.query({ filter: { id: { eq: id } } });

    const [quote] = await this.Model.aggregate([
      { $match: { quotationNo: quotationNo } },
      {
        $lookup: {
          from: 'aircraft-details',
          localField: 'aircraft',
          foreignField: '_id',
          as: 'aircraftDetail',
        },
      },
      {
        $unwind: { path: '$aircraftDetail', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: 'aircraft-categories',
          localField: 'category',
          foreignField: '_id',
          as: 'aircraftCategory',
        },
      },
      {
        $unwind: {
          path: '$aircraftCategory',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'clients',
          localField: 'requestedBy',
          foreignField: '_id',
          as: 'client',
        },
      },
      { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          itinerary: 1,
          quotationNo: 1,
          proformaInvoiceNo: 1,
          aircraftDetail: 1,
          'aircraftCategory.name': 1,
          'client.name': 1,
          'client.phone': 1,
          'client.email': 1,
          'client.address': 1,
          status: 1,
          prices: 1,
          grandTotal: 1,
          createdAt: 1,
        },
      },
    ]);

    if (!quote) throw new BadRequestException('No Quote Found');

    const airportcodes: any = Array.from(
      new Set(
        quote.itinerary.flatMap((segment: any) => [
          segment.source,
          segment.destination,
        ]),
      ),
    );

    const quoteSegments = await this.airportService.query({
      filter: { iata_code: { in: airportcodes } },
      projection: { _id: 0, createdAt: 0, updatedAt: 0, isActive: 0 },
    });

    quote.itinerary.forEach((segment: any) => {
      const source = quoteSegments.find(
        (s: any) => s.iata_code === segment.source,
      );
      const destination = quoteSegments.find(
        (s: any) => s.iata_code === segment.destination,
      );
      segment.source = source;
      segment.destination = destination;
      const duration = calculateDuration(
        segment.depatureTime,
        segment.arrivalTime,
      );
      segment.apxFlyTime = duration;
    });

    /** calculate price  */
    quote['gstAmount'] = Number((quote.grandTotal * 0.18).toFixed(2)); //18%GST

    quote['totalPrice'] = Number(
      (quote.grandTotal + quote.gstAmount).toFixed(2),
    );

    return quote;
  }

  async preview(quotationNo) {
    const [quotationTemp] = await this.quotationTemplate
      .find({ quotationNo, type: TemplateType.QUOTATION })
      .sort({ createdAt: -1 })
      .limit(1);

    if (quotationTemp) {
      return quotationTemp.template;
    } else {
      const quote = await this.getQuoteById(quotationNo);
      if (!quote) throw new BadRequestException('No Quote Found');

      const htmlContent = QuotePdfTemplate(quote);
      return htmlContent;
    }
  }

  async generateQuotationNumber(): Promise<string> {
    const currentYear = new Date().getFullYear() % 100; // Get last two digits of the year

    const counter = await this.counterModel.findOneAndUpdate(
      { year: currentYear, type: CounterType.quotation },
      { $inc: { serial: 1 } },
      { new: true, upsert: true },
    );

    const serialNumber = counter.serial.toString().padStart(4, '0'); // Format serial to 4 digits
    return `AOQT/${currentYear}/${serialNumber}`;
  }

  async generateInvoice(args) {
    const { id, quotationNo, isRevised } = args;

    const quote = await this.getQuoteById(quotationNo);
    if (!quote) throw new BadRequestException('No Quote Found');

    let htmlContent = InvoiceTemplate(quote);
    if (!htmlContent) throw new BadRequestException('No Content Found');

    let proformaInvoiceNo = quote.proformaInvoiceNo ?? '';
    let proformaInvoiceRevision = quotationNo?.proformaInvoiceRevision ?? 0;
    if (!isRevised) {
      proformaInvoiceNo = await this.generateProformaInvoiceNumber();
    } else {
      proformaInvoiceRevision += 1;
      proformaInvoiceNo = `${proformaInvoiceNo}/R${proformaInvoiceRevision}`;
    }

    await this.updateOne(quote._id.toString(), {
      proformaInvoiceNo,
      proformaInvoiceRevision,
    });

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

  async updateOneQuote(input) {
    const { id, update } = input;

    const [quotation] = await this.query({
      filter: {
        id: { eq: id },
      },
    });
    if (!quotation) {
      throw new BadRequestException('No Quote Found');
    }

    const originalQuotation = quotation.quotationNo.split('/R')[0];
    update.version = quotation.version + 1;
    update.revision = quotation.version + 1;
    update.status = QuoteStatus.QUOTE;
    update.quotationNo = `${originalQuotation}/R${update.revision}`;
    update.code = quotation.code;

    const updated = await this.createOne(update);
    if (!updated)
      throw new InternalServerErrorException('Error in updating quote');

    await this.updateOne(id, {
      isLatest: false,
      // status: QuoteStatus.DEPRECATED,
    });

    return updated;
  }
}
