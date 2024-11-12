import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';
import {
  RolePermissionEntity,
  RolePermissionSchema,
} from './entities/role-permission.entity';
import { RolePermissionDTO } from './dto/role-permission.dto';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: RolePermissionEntity,
            name: RolePermissionEntity.name,
            schema: RolePermissionSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: RolePermissionDTO,
          EntityClass: RolePermissionEntity,
        },
      ],
    }),
  ],
  providers: [],
})
export class RolePermissionModule {}
