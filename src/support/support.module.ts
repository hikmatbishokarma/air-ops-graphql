import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { TicketEntity, TicketSchema } from './entities/ticket.entity';
import { TicketDto } from './dto/ticket.dto';
import { SupportService } from './services/support.service';
import { MessageResolver, SupportResolver } from './resolvers/support.resolver';
import { CrewDetailModule } from 'src/crew-details/crew-detail.module';

@Module({
    imports: [
        CrewDetailModule,
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
            ],
            resolvers: [
                {
                    DTOClass: TicketDto,
                    EntityClass: TicketEntity,
                },
            ],
        }),
    ],
    providers: [SupportService, SupportResolver, MessageResolver],
    exports: [SupportService],
})
export class SupportModule { }
