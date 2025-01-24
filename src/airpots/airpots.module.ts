import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';
import { AirpotsEntity, AirpotsSchema } from './entities/airpots.entity';
import { AirpotsDto } from './dto/airpots.dto';
import { AirpotsService } from './services/airpots.service';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: AirpotsEntity,
            name: AirpotsEntity.name,
            schema: AirpotsSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: AirpotsDto,
          EntityClass: AirpotsEntity,
        },
      ],
    }),
  ],
  providers: [AirpotsService],
})
export class AirpotsModule {}
