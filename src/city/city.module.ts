import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';
import { CityEntity, CitySchema } from './entities/city.entity';
import { CityDto } from './dto/city.dto';
import { CityService } from './services/city.service';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: CityEntity,
            name: CityEntity.name,
            schema: CitySchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: CityDto,
          EntityClass: CityEntity,
        },
      ],
    }),
  ],
  providers: [CityService],
})
export class CityModule {}
