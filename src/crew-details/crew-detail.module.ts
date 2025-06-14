import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CrewDetailEntity,
  CrewDetailSchema,
} from './entities/crew-detail.entity';
import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { CrewDetailDto } from './dto/crew-detail.dto';
import { CrewDetailService } from './services/crew-detail.service';
import { CrewDetailResolver } from './resolvers/crew-detail.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CrewDetailEntity.name, schema: CrewDetailSchema },
    ]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: CrewDetailEntity,
            name: CrewDetailEntity.name,
            schema: CrewDetailSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: CrewDetailDto,
          EntityClass: CrewDetailEntity,
        },
      ],
    }),
  ],

  providers: [CrewDetailService, CrewDetailResolver],
  exports: [CrewDetailService],
})
export class CrewDetailModule {}
