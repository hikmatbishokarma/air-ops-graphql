import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { QuotesEntity, QuotesSchema } from './entities/quotes.entity';
import { QuotesDto } from './dto/quotes.dto';
import { QuotesService } from './services/quotes.service';
import { AirportsModule } from 'src/airports/airports.module';
import { QuotesResolver } from './resolvers/quotes.resolver';
import { AircraftDetailModule } from 'src/aircraft-detail/aircraft-detail.module';

@Module({
  imports: [
    AirportsModule,
    AircraftDetailModule,
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: QuotesEntity,
            name: QuotesEntity.name,
            schema: QuotesSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: QuotesDto,
          EntityClass: QuotesEntity,
        },
      ],
    }),
  ],
  providers: [QuotesService, QuotesResolver],
  exports: [QuotesService],
})
export class QuotesModule {}
