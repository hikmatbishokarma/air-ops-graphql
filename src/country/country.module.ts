import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';
import { CountryEntity, CountrySchema } from './entities/country.entity';
import { CountryDto } from './dto/country.dto';
import { CountryService } from './services/country.service';
import { CountryResolver } from './resolvers/country.resolver';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: CountryEntity,
            name: CountryEntity.name,
            schema: CountrySchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: CountryDto,
          EntityClass: CountryEntity,
        },
      ],
    }),
  ],
  providers: [CountryService, CountryResolver],
})
export class CountryModule {}
