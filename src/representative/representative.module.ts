import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';
import {
  RepresentativeEntity,
  RepresentativeSchema,
} from './entities/representative.entity';
import { RepresentativeService } from './services/representative.service';
import { RepresentativeDto } from './dto/representative.dto';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: RepresentativeEntity,
            name: RepresentativeEntity.name,
            schema: RepresentativeSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: RepresentativeDto,
          EntityClass: RepresentativeEntity,
        },
      ],
    }),
  ],
  providers: [RepresentativeService],
})
export class RepresentativeModule {}
