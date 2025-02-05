import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { PriceEntity, PriceSchema } from './entities/price.entity';
import { PriceDto } from './dto/price.dto';
import { PriceService } from './services/price.service';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: PriceEntity,
            name: PriceEntity.name,
            schema: PriceSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: PriceDto,
          EntityClass: PriceEntity,
        },
      ],
    }),
  ],
  providers: [PriceService],
  exports: [PriceService],
})
export class PriceModule {}
