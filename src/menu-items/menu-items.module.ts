import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';
import { MenuItemsEntity, MenuItemsSchema } from './entities/menu-items.entity';
import { MenuItemsDTO } from './dto/menu-items.dto';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: MenuItemsEntity,
            name: MenuItemsEntity.name,
            schema: MenuItemsSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: MenuItemsDTO,
          EntityClass: MenuItemsEntity,
        },
      ],
    }),
  ],
  providers: [],
})
export class MenuItemsModule {}
