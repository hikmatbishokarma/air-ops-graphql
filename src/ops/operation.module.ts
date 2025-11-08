import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';

import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { GqlRolesGuard } from 'src/roles/gql-roles.guard';
import { TripDetailService } from './services/trip-detail.service';
import { TripDetailResolver } from './resolvers/trip-detail.resolver';
import {
  TripDetailEntity,
  TripDetailSchema,
} from './entities/trip-detail.entity';
import { TripDetailDto } from './dto/trip-detail.dto';
import { QuotesModule } from 'src/quotes/quotes.module';
import { CrewDetailModule } from 'src/crew-details/crew-detail.module';
import { CrewTripUploadedDocResolver } from './resolvers/crew-trip.resolver';

@Module({
  imports: [
    QuotesModule,
    CrewDetailModule,
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        TripDetailModule,
        NestjsQueryMongooseModule.forFeature([
          {
            document: TripDetailEntity,
            name: TripDetailEntity.name,
            schema: TripDetailSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: TripDetailDto,
          EntityClass: TripDetailEntity,
          guards: [GqlAuthGuard, GqlRolesGuard], // <- Add your guards here
        },
      ],
    }),
  ],
  providers: [
    TripDetailService,
    TripDetailResolver,
    CrewTripUploadedDocResolver,
  ],
  exports: [TripDetailService],
})
export class TripDetailModule {}
