import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManualEntity, ManualSchema } from './entities/manual.entity';
import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { ManualDto } from './dto/manual.dto';
import { ManualService } from './services/manual.service';
import { ManualResolver } from './resolvers/manual.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ManualEntity.name, schema: ManualSchema },
    ]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: ManualEntity,
            name: ManualEntity.name,
            schema: ManualSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: ManualDto,
          EntityClass: ManualEntity,
        },
      ],
    }),
  ],
  providers: [ManualService, ManualResolver],
})
export class ManualModule {}
