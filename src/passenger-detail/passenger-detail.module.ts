import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';

import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { GqlRolesGuard } from 'src/roles/gql-roles.guard';
import {
  PassengerDetailEntity,
  PassengerDetailSchema,
} from './entities/passenger-detail.entity';
import { PassengerDetailDto } from './dto/passenger-detail.dto';
import { PassengerDetailService } from './services/passenger-detail.service';
import { PassengerDetailResolver } from './resolvers/passenger-detail.resolver';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: PassengerDetailEntity,
            name: PassengerDetailEntity.name,
            schema: PassengerDetailSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: PassengerDetailDto,
          EntityClass: PassengerDetailEntity,
          guards: [GqlAuthGuard, GqlRolesGuard], // <- Add your guards here
        },
      ],
    }),
  ],
  providers: [PassengerDetailService, PassengerDetailResolver],
  exports: [PassengerDetailService],
})
export class PassengerDetailModule {}
