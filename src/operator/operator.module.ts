import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { forwardRef, Module } from '@nestjs/common';

import { OperatorEntity, OperatorSchema } from './entities/operator.entity';
import { OperatorDto } from './dto/operator.dto';

import { OperatorResolver } from './resolvers/operator.resolver';
import { OperatorService } from './services/operator.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: OperatorEntity,
            name: OperatorEntity.name,
            schema: OperatorSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: OperatorDto,
          EntityClass: OperatorEntity,
        },
      ],
    }),
  ],
  providers: [OperatorResolver, OperatorService],
  exports: [OperatorService],
})
export class OperatorModule {}
