import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { QuotesEntity, QuotesSchema } from './entities/quotes.entity';
import { QuotesDto } from './dto/quotes.dto';
import { QuotesService } from './services/quotes.service';
import { AirportsModule } from 'src/airports/airports.module';
import { QuotesResolver } from './resolvers/quotes.resolver';
import { AircraftDetailModule } from 'src/aircraft-detail/aircraft-detail.module';

import { MongooseModule } from '@nestjs/mongoose';
import { Counter, CounterSchema } from './entities/counter.entity';
import {
  QuotationTemplateEntity,
  QuotationTemplateSchema,
} from './entities/quote-template.entity';
import { InvoiceService } from './services/invoice.service';
import { InvoiceResolver } from './resolvers/invoice.resolver';
import { InvoiceEntity, InvoiceSchema } from './entities/invoice.entity';
import { InvoiceDto } from './dto/invoice.dto';

@Module({
  imports: [
    AirportsModule,
    AircraftDetailModule,
    MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }]),
    MongooseModule.forFeature([
      { name: QuotationTemplateEntity.name, schema: QuotationTemplateSchema },
    ]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        QuotesModule,
        NestjsQueryMongooseModule.forFeature([
          {
            document: QuotesEntity,
            name: QuotesEntity.name,
            schema: QuotesSchema,
          },

          {
            document: InvoiceEntity,
            name: InvoiceEntity.name,
            schema: InvoiceSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: QuotesDto,
          EntityClass: QuotesEntity,
        },
        {
          DTOClass: InvoiceDto,
          EntityClass: InvoiceEntity,
        },
      ],
    }),
  ],
  providers: [QuotesService, QuotesResolver,InvoiceService,InvoiceResolver],
  exports: [QuotesService,InvoiceService],
})
export class QuotesModule {}
