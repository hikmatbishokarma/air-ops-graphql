import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MongooseQueryService } from '@app/query-mongoose';
import { QuotesEntity } from '../entities/quotes.entity';
import { AirportsService } from 'src/airports/services/airports.service';
import { AircraftDetailService } from 'src/aircraft-detail/services/aircraft-detail.service';
import { QuoteStatus } from 'src/app-constants/enums';
import { DeepPartial } from '@app/core';
import { MailerService } from 'src/notification/services/mailer.service';
import { QuotePdfTemplate } from 'src/notification/templates/email.template';

const {
  NEW_REQUEST,
  QUOTED,
  OPPORTUNITY,
  APPROVAL,
  BOOKED,
  DONE,
  CONTRACT_SENT,
  INVOICE_SENT,
  OPTION,
} = QuoteStatus;
const quotationWorkflowTransition = {
  'new request': [QUOTED],
  quoted: [BOOKED, OPPORTUNITY],
  BOOKED: [DONE],
};

@Injectable()
export class QuotesService extends MongooseQueryService<QuotesEntity> {
  constructor(
    @InjectModel(QuotesEntity.name) model: Model<QuotesEntity>,
    private readonly airportService: AirportsService,
    private readonly aircraftService: AircraftDetailService,
    private readonly mailerService: MailerService,
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

    if (state === QuoteStatus.DONE) {
      //TODO: notifiy customer
    }
    const updatedQuotation = await this.updateOne(id, { status: state });
    return updatedQuotation;
  }

  async upgrade(code: string) {
    const [draftQuotate] = await this.query({
      filter: {
        referenceNumber: { eq: code },
        status: { eq: QuoteStatus.NEW_REQUEST },
      },
    });

    if (draftQuotate) {
      throw new BadRequestException('A draft version already exists');
    }

    const [quotation] = await this.query({
      filter: {
        referenceNumber: { eq: code },
        status: { eq: QuoteStatus.QUOTED },
      },
    });
    if (!quotation) {
      throw new BadRequestException('No Quotated version exists');
    }

    const clonedQuotation: DeepPartial<QuotesEntity> = {
      ...quotation.toObject(),
    };

    clonedQuotation.version += 1;
    clonedQuotation.status = QuoteStatus.NEW_REQUEST;
    delete clonedQuotation._id;

    const created = await this.createOne(clonedQuotation);
    await this.updateOne(quotation._id.toString(), {
      isLatest: false,
      status: QuoteStatus.UPGRADED,
    });
    return created;
  }

  private isValidTransition(
    currentState: QuoteStatus,
    newState: QuoteStatus,
  ): boolean {
    return quotationWorkflowTransition[currentState].includes(newState);
  }

  async getQuoteById(id) {
    const [quote] = await this.query({ filter: { id: { eq: id } } });

    if (!quote) throw new BadRequestException('No Quote Found');

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
    return quote;
  }

  async generateQuotePdf(args) {
    const { id, email } = args;
    const quote = await this.getQuoteById(id);
    if (!quote) throw new BadRequestException('No Quote Found');

    const filePath = 'quote.pdf';
    const htmlContent = QuotePdfTemplate();
    const to = email || 'bkhikmat5024@gmail.com';
    const subject = `Your Flight Quote - Reference No. ${quote?.referenceNumber ?? '123'} `;
    const text = `We are Pleased to offer to you the Hawker Beechcraft 750 Aircraf`;

    const pdfPath = await this.mailerService.createPDF(filePath, htmlContent);

    const attachments = [{ filename: 'document.pdf', path: pdfPath }];

    await this.mailerService.sendEmail(to, subject, text, null, attachments);

    return 'PDF sent successfully!';
  }
}
