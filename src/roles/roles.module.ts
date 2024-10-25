import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';
import { RoleEntity, RoleSchema } from './entities/roles.entity';
import { RoleDTO } from './dto/roles.dto';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: RoleEntity,
            name: RoleEntity.name,
            schema: RoleSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: RoleDTO,
          EntityClass: RoleEntity,
        },
      ],
    }),
  ],
})
export class RolesModule {}
