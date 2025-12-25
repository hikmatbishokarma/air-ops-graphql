import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CrewDetailEntity,
  CrewDetailSchema,
} from './entities/crew-detail.entity';
import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { CrewDetailDto } from './dto/crew-detail.dto';
import { CrewDetailService } from './services/crew-detail.service';
import { CrewDetailResolver } from './resolvers/crew-detail.resolver';
import { OperatorModule } from 'src/operator/operator.module';
import { RolesModule } from 'src/roles/roles.module';
import { NotificationModule } from 'src/notification/notification.module';
import { CrewAuthService } from './services/crew-auth.service';

@Module({
  imports: [
    forwardRef(() => NotificationModule),
    forwardRef(() => OperatorModule),
    RolesModule,
    MongooseModule.forFeature([
      { name: CrewDetailEntity.name, schema: CrewDetailSchema },
    ]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryMongooseModule.forFeature([
          {
            document: CrewDetailEntity,
            name: CrewDetailEntity.name,
            schema: CrewDetailSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: CrewDetailDto,
          EntityClass: CrewDetailEntity,
        },
      ],
    }),
  ],

  providers: [CrewDetailService, CrewDetailResolver, CrewAuthService],
  exports: [CrewDetailService, CrewAuthService],
})
export class CrewDetailModule { }
