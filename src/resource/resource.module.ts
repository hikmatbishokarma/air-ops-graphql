import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';
import { ResourceEntity, ResourceSchema } from './entities/resource.entity';
import { ResourceDto } from './dto/resource.dto';
import { ResourceService } from './services/resource.service';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: ResourceEntity,
            name: ResourceEntity.name,
            schema: ResourceSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: ResourceDto,
          EntityClass: ResourceEntity,
        },
      ],
    }),
  ],
  providers: [ResourceService],
})
export class ResourceModule {}
