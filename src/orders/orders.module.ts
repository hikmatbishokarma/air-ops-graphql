import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { Module } from '@nestjs/common';
import { OrderEntity, OrdersSchema } from './entities/orders.entity';
import { OrdersDTO } from './dto/orders.dto';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: OrderEntity,
            name: OrderEntity.name,
            schema: OrdersSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: OrdersDTO,
          EntityClass: OrderEntity,
        },
      ],
    }),
  ],
  providers: [],
})
export class OrdersModule {}
