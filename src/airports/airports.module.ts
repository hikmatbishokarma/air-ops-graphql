import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';
import { AirportsEntity, AirportsSchema } from './entities/airports.entity';
import { AirportsDto } from './dto/airports.dto';
import { AirportsService } from './services/airports.service';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: AirportsEntity,
            name: AirportsEntity.name,
            schema: AirportsSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: AirportsDto,
          EntityClass: AirportsEntity,
        },
      ],
    }),
  ],
  providers: [AirportsService],
  exports: [AirportsService],
})
export class AirportsModule {}
