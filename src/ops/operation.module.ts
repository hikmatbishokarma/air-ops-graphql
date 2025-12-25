import { forwardRef, Module } from '@nestjs/common';
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
import { QuotesEntity, QuotesSchema } from 'src/quotes/entities/quotes.entity'; // Import this
import { CrewDetailModule } from 'src/crew-details/crew-detail.module';
import { CrewTripUploadedDocResolver } from './resolvers/crew-trip.resolver';
import { PassengerDetailModule } from 'src/passenger-detail/passenger-detail.module';
import { PassengerDetailEntity, PassengerDetailSchema } from 'src/passenger-detail/entities/passenger-detail.entity';

import { OpsDashboardService } from './services/ops-dashboard.service';
import { OpsDashboardResolver } from './resolvers/ops-dashboard.resolver';
import { BoardingPassEntity, BoardingPassSchema } from './entities/boarding-pass.entity';
import { BoardingPassService } from './services/boarding-pass.service';
import { BoardingPassResolver } from './resolvers/boarding-pass.resolver';
import { AirportsEntity, AirportsSchema } from 'src/airports/entities/airports.entity';
import { IntimationEntity, IntimationSchema } from './entities/intimation.entity';
import { IntimationService } from './services/intimation.service';
import { IntimationResolver } from './resolvers/intimation.resolver';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    QuotesModule,
    forwardRef(() => CrewDetailModule),
    PassengerDetailModule,
    forwardRef(() => NotificationModule),
    MongooseModule.forFeature([
      { name: QuotesEntity.name, schema: QuotesSchema },
      { name: BoardingPassEntity.name, schema: BoardingPassSchema },
      { name: PassengerDetailEntity.name, schema: PassengerDetailSchema },
      { name: AirportsEntity.name, schema: AirportsSchema },
      { name: IntimationEntity.name, schema: IntimationSchema },
    ]),
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
    OpsDashboardService,
    OpsDashboardResolver,
    BoardingPassService,
    BoardingPassResolver,
    IntimationService,
    IntimationResolver,
  ],
  exports: [TripDetailService, OpsDashboardService, BoardingPassService],
})
export class TripDetailModule { }
