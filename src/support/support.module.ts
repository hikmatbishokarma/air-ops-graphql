import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { TicketEntity, TicketSchema } from './entities/ticket.entity';
import { TicketDto } from './dto/ticket.dto';
import { SupportService } from './services/support.service';
import { MessageResolver, SupportResolver } from './resolvers/support.resolver';
import { CrewDetailModule } from 'src/crew-details/crew-detail.module';
import { NotificationModule } from 'src/notification/notification.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
    imports: [
        CrewDetailModule,
        NotificationModule,
        RolesModule,
        MongooseModule.forFeature([
            { name: TicketEntity.name, schema: TicketSchema },
        ]),
        NestjsQueryGraphQLModule.forFeature({
            imports: [
                NestjsQueryMongooseModule.forFeature([
                    {
                        document: TicketEntity,
                        name: TicketEntity.name,
                        schema: TicketSchema,
                    },
                ]),
                CrewDetailModule,
                NotificationModule,
                RolesModule,
            ],
            services: [SupportService],
            resolvers: [
                {
                    DTOClass: TicketDto,
                    EntityClass: TicketEntity,
                    ServiceClass: SupportService,
                },
            ],
        }),
    ],
    providers: [SupportService, SupportResolver, MessageResolver],
    exports: [SupportService],
})
export class SupportModule { }
