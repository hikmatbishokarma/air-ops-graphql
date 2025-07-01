import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { SecurityDto } from './dto/security.dto';
import { SecurityService } from './services/security.service';
import { SecurityResolver } from './resolvers/security.resolver';
import { SecurityEntity, SecuritySchema } from './entities/security.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SecurityEntity.name, schema: SecuritySchema },
    ]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: SecurityEntity,
            name: SecurityEntity.name,
            schema: SecuritySchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: SecurityDto,
          EntityClass: SecurityEntity,
        },
      ],
    }),
  ],
  providers: [SecurityService, SecurityResolver],
})
export class SecurityModule {}
