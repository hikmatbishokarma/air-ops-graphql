import {
  BadRequestException,
  forwardRef,
  Inject,
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
import { QuotePdfTemplate } from 'src/notification/templates/quote.template';
import { Counter } from '../entities/counter.entity';
import { QuotationTemplateEntity } from '../entities/quote-template.entity';
import { InvoiceTemplate } from 'src/notification/templates/invoice.template';
import { calculateDuration, getDuration } from 'src/common/helper';
import { SaleConfirmationTemplate } from 'src/notification/templates/sale-confirmation';
import moment from 'moment';
import e from 'express';
import { ConfigService } from '@nestjs/config';
import { PassengerDetailService } from 'src/passenger-detail/services/passenger-detail.service';

import { join } from 'path';
import * as puppeteer from 'puppeteer';
import { readFile } from 'fs/promises';
import { CrewDetailEntity } from 'src/crew-details/entities/crew-detail.entity';

const { QUOTE, TAX_INVOICE, PROFOMA_INVOICE, CANCELLED } = QuoteStatus;
const quotationWorkflowTransition = {
  Quote: [CANCELLED, TAX_INVOICE, PROFOMA_INVOICE],
};

@Injectable()
export class QuotesService extends MongooseQueryService<QuotesEntity> {
  private apiUrl: string;
  private airOpsLogo: string;
  private cloudFrontUrl: string;
  constructor(
    @InjectModel(QuotesEntity.name) model: Model<QuotesEntity>,
    private readonly airportService: AirportsService,
    private readonly aircraftService: AircraftDetailService,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
    @InjectModel(QuotationTemplateEntity.name)
    private quotationTemplate: Model<QuotationTemplateEntity>,
    private readonly config: ConfigService,
    @Inject(forwardRef(() => PassengerDetailService))
    private readonly passengerDetailService: PassengerDetailService,
    @InjectModel(CrewDetailEntity.name)
    private crewDetailModel: Model<CrewDetailEntity>,
  ) {
    super(model);
    this.apiUrl = this.config.get<string>('api_url');
    this.airOpsLogo = this.config.get<string>('logo');
    this.cloudFrontUrl = this.config.get<string>('s3.aws_cloudfront_base_url');
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

  async getQuoteByQuotatioNo(quotationNo = null) {
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
        $lookup: {
          from: 'operators',
          localField: 'operatorId',
          foreignField: '_id',
          as: 'operator',
        },
      },
      { $unwind: { path: '$operator', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          itinerary: 1,
          quotationNo: 1,
          proformaInvoiceNo: 1,
          aircraftDetail: 1,
          'aircraftCategory.name': 1,
          client: 1,
          operator: 1,
          status: 1,
          prices: 1,
          grandTotal: 1,
          createdAt: 1,
          sectors: 1,
        },
      },
    ]);

    if (!quote) throw new BadRequestException('No Quote Found');

    // const airportcodes: any = Array.from(
    //   new Set(
    //     quote.itinerary.flatMap((segment: any) => [
    //       segment.source,
    //       segment.destination,
    //     ]),
    //   ),
    // );

    // const quoteSegments = await this.airportService.query({
    //   filter: { iata_code: { in: airportcodes } },
    //   projection: { _id: 0, createdAt: 0, updatedAt: 0, isActive: 0 },
    // });

    // quote.itinerary.forEach((segment: any) => {
    //   const source = quoteSegments.find(
    //     (s: any) => s.iata_code === segment.source,
    //   );
    //   const destination = quoteSegments.find(
    //     (s: any) => s.iata_code === segment.destination,
    //   );
    //   segment.source = source;
    //   segment.destination = destination;
    //   const duration = calculateDuration(
    //     segment.depatureTime,
    //     segment.arrivalTime,
    //   );
    //   segment.apxFlyTime = duration;
    // });

    quote?.sectors?.forEach((segment: any) => {
      const duration = calculateDuration(
        segment.depatureTime,
        segment.arrivalTime,
      );
      segment.apxFlyTime = duration;
    });

    const crew = await this.crewDetailModel.findOne(
      { operatorId: quote?.operator?._id },
      { bankDetails: 1, location: 1, userName: 1 },
    );

    /** calculate price  */
    quote['gstAmount'] = Number((quote.grandTotal * 0.18).toFixed(2)); //18%GST

    quote['totalPrice'] = Number(
      (quote.grandTotal + quote.gstAmount).toFixed(2),
    );

    //activate bankdetails
    crew['activeBankdetail'] = crew?.bankDetails?.find(
      (item) => item?.isDefault,
    );

    return { ...quote, id: quote._id, crew };
  }

  async preview(quotationNo) {
    const [quotationTemp] = await this.quotationTemplate
      .find({ quotationNo, type: TemplateType.QUOTATION })
      .sort({ createdAt: -1 })
      .limit(1);

    if (quotationTemp) {
      return quotationTemp.template;
    } else {
      const quote = await this.getQuoteByQuotatioNo(quotationNo);

      const logoUrl = quote?.operator
        ? `${this.cloudFrontUrl}${quote?.operator?.companyLogo}`
        : this.airOpsLogo;

      if (!quote) throw new BadRequestException('No Quote Found');

      const htmlContent = QuotePdfTemplate({
        ...quote,
        logoUrl,
        apiUrl: this.apiUrl,
        cloudFrontUrl: this.cloudFrontUrl,
      });
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

    const quote = await this.getQuoteByQuotatioNo(quotationNo);
    if (!quote) throw new BadRequestException('No Quote Found');

    const logoUrl = quote?.operator
      ? `${this.cloudFrontUrl}${quote?.operator?.companyLogo}`
      : this.airOpsLogo;

    let htmlContent = InvoiceTemplate({
      ...quote,
      logoUrl,
      cloudFrontUrl: this.cloudFrontUrl,
    });
    if (!htmlContent) throw new BadRequestException('No Content Found');

    let proformaInvoiceNo = quote.proformaInvoiceNo ?? '';
    let proformaInvoiceRevision = quotationNo?.proformaInvoiceRevision ?? 0;
    if (!isRevised) {
      proformaInvoiceNo = await this.generateProformaInvoiceNumber();
    } else {
      proformaInvoiceRevision += 1;
      proformaInvoiceNo = `${proformaInvoiceNo}/R${proformaInvoiceRevision}`;
    }

    // await this.updateOne(quote._id.toString(), {
    //   proformaInvoiceNo,
    //   // proformaInvoiceRevision,
    // });

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

  async saleConfirmation(args) {
    const { quotationNo } = args;

    const quote = await this.getQuoteByQuotatioNo(quotationNo);
    if (!quote) throw new BadRequestException('No Quote Found');

    const [passengerInfo] = await this.passengerDetailService.query({
      filter: {
        quotation: { eq: quote._id },
        quotationNo: { eq: quote.quotationNo },
      },
    });

    const logoUrl = quote?.operator
      ? `${this.cloudFrontUrl}${quote?.operator?.companyLogo}`
      : this.airOpsLogo;

    const htmlContent = SaleConfirmationTemplate({
      ...quote,
      logoUrl,
      passengerInfo,
    });
    if (!htmlContent) throw new BadRequestException('No Content Found');

    const updateQuote = await this.updateOne(quote._id.toString(), {
      status: QuoteStatus.SALE_CONFIRMED,
      confirmationTemplate: htmlContent,
    });
    if (!updateQuote) throw new BadRequestException('Error in updating quote');
    return updateQuote;
  }

  async previewSalesConfirmation(quotationNo) {
    const quote = await this.getQuoteByQuotatioNo(quotationNo);
    if (!quote) throw new BadRequestException('No Quote Found');

    const [passengerInfo] = await this.passengerDetailService.query({
      filter: {
        quotation: { eq: quote._id },
        quotationNo: { eq: quote.quotationNo },
      },
    });

    const logoUrl = quote?.operator
      ? `${this.cloudFrontUrl}${quote?.operator?.companyLogo}`
      : this.airOpsLogo;

    const htmlContent = SaleConfirmationTemplate({
      ...quote,
      logoUrl,
      passengerInfo,
    });
    if (!htmlContent) throw new BadRequestException('No Content Found');

    return htmlContent;
  }

  async flightSegmentsForCalendar(args) {
    const { id, startDate, endDate, operatorId } = args;

    // const segments: any = await this.Model.find({
    //   // itinerary: {
    //   //   $elemMatch: {
    //   //     depatureDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    //   //   },
    //   // },

    //   itinerary: {
    //     $elemMatch: {
    //       depatureDate: {
    //         $gte: '2025-06-01T18:30:00.000Z',
    //         $lte: '2025-06-30T18:30:00.000Z',
    //       },
    //     },
    //   },
    // });

    const segments: any = await this.Model.find({
      sectors: {
        $elemMatch: {
          depatureDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      status: QuoteStatus.TRIP_GENERATED,
      ...(operatorId && { operatorId }),
    }).select({ sectors: 1, aircraft: 1 });

    const aircraftIds = segments.map((item) => item.aircraft);

    const aircraftList = await this.aircraftService.query({
      filter: { id: { in: aircraftIds } },
      projection: { name: 1, code: 1 },
    });

    // --- NEW CODE: Create the aircraft map ---
    const aircraftMap = aircraftList.reduce((acc, aircraft) => {
      acc[aircraft.id.toString()] = aircraft; // Map aircraft ID to the aircraft object
      return acc;
    }, {});

    const calenderData = [];

    for (const segment of segments) {
      const aircraftDetails = aircraftMap[segment.aircraft.toString()];

      for (const leg of segment?.sectors) {
        const dep = new Date(leg.depatureDate);
        if (dep >= startDate && dep <= endDate) {
          calenderData.push({
            id: segment.id,
            title: `${leg?.source?.code} → ${leg?.destination?.code}`,
            source: leg?.source?.code,
            destination: leg?.destination?.code,
            // start: leg.depatureDate,
            start: new Date(
              `${moment(leg.depatureDate).format('YYYY-MM-DD')}T${leg.depatureTime}:00Z`,
            ),
            end: new Date(
              `${moment(leg.arrivalDate).format('YYYY-MM-DD')}T${leg.arrivalTime}:00Z`,
            ),
            depatureTime: leg.depatureTime,
            arrivalTime: leg.arrivalTime,
            aircraft: aircraftDetails,
            duration: getDuration(leg.depatureTime, leg.arrivalTime),
          });
        }
      }
    }

    // return { calenderData: calenderData };
    return calenderData;
  }

  async updateQuote(where, data) {
    await this.Model.findOneAndUpdate(where, { $set: data }, { new: true });
  }
}
