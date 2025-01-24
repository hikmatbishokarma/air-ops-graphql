import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';
import {
  AircraftCategoriesEntity,
  AircraftCategoriesSchema,
} from './entities/aircraft-categories.entity';
import { AircraftCategoriesDto } from './dto/aircraft-categories.dto';
import { AircraftCategoriesService } from './services/aircraft-categories.service';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: AircraftCategoriesEntity,
            name: AircraftCategoriesEntity.name,
            schema: AircraftCategoriesSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: AircraftCategoriesDto,
          EntityClass: AircraftCategoriesEntity,
        },
      ],
    }),
  ],
  providers: [AircraftCategoriesService],
})
export class AircraftCategoriesModule {}
