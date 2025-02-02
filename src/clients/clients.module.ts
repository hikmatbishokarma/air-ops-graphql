import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';
import { ClientsEntity, ClientsSchema } from './entities/clients.entity';
import { ClientsDto } from './dto/clients.dto';
import { ClientsService } from './services/clients.service';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: ClientsEntity,
            name: ClientsEntity.name,
            schema: ClientsSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: ClientsDto,
          EntityClass: ClientsEntity,
        },
      ],
    }),
  ],
  providers: [ClientsService],
})
export class ClientsModule {}
