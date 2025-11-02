import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';
import { CityEntity, CitySchema } from './entities/city.entity';
import { CityDto } from './dto/city.dto';
import { CityService } from './services/city.service';
import { CityResolver } from './resolvers/city.resolver';
import { StateEntity, StateSchema } from './entities/state.entity';
import { StateDto } from './dto/state.dto';
import { StateService } from './services/state.service';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: StateEntity,
            name: StateEntity.name,
            schema: StateSchema,
          },
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
        {
          DTOClass: StateDto,
          EntityClass: StateEntity,
        },
      ],
    }),
  ],
  providers: [CityService, CityResolver, StateService],
})
export class CityModule {}
