import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';
import { AircraftsDto } from 'src/aircrafts/dto/aircrafts.dto';

import {
  AircraftsEntity,
  AircraftsSchema,
} from 'src/aircrafts/entities/aircrafts.entity';
import { AircraftsService } from 'src/aircrafts/services/aircrafts.service';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: AircraftsEntity,
            name: AircraftsEntity.name,
            schema: AircraftsSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: AircraftsDto,
          EntityClass: AircraftsEntity,
        },
      ],
    }),
  ],
  providers: [AircraftsService],
  exports: [AircraftsService],
})
export class AircraftsModule {}
