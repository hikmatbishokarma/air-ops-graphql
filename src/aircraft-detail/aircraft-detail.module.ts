import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { forwardRef, Module } from '@nestjs/common';

import {
  AircraftDetailEntity,
  AircraftDetailSchema,
} from 'src/aircraft-detail/entities/aircraft-detail.entity';
import { AircraftDetailService } from 'src/aircraft-detail/services/aircraft-detail.service';
import { AircraftDetailDto } from './dto/aircraft-detail.dto';
import { QuotesModule } from 'src/quotes/quotes.module';

@Module({
  imports: [
    forwardRef(() => QuotesModule),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        AircraftDetailModule,
        NestjsQueryMongooseModule.forFeature([
          {
            document: AircraftDetailEntity,
            name: AircraftDetailEntity.name,
            schema: AircraftDetailSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: AircraftDetailDto,
          EntityClass: AircraftDetailEntity,
        },
      ],
    }),
  ],
  providers: [AircraftDetailService],
  exports: [AircraftDetailService],
})
export class AircraftDetailModule {}
