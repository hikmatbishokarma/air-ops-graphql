import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';
import { RoleEntity, RoleSchema } from './entities/roles.entity';
import { RoleDTO } from './dto/roles.dto';
import { RolesService } from './services/roles.service';

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
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
