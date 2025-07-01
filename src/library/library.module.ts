import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { LibraryDto } from './dto/library.dto';
import { LibraryService } from './services/library.service';
import { LibraryResolver } from './resolvers/library.resolver';
import { LibraryEntity, LibrarySchema } from './entities/library.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LibraryEntity.name, schema: LibrarySchema },
    ]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: LibraryEntity,
            name: LibraryEntity.name,
            schema: LibrarySchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: LibraryDto,
          EntityClass: LibraryEntity,
        },
      ],
    }),
  ],
  providers: [LibraryService, LibraryResolver],
})
export class LibraryModule {}
