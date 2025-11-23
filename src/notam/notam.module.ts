import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';

import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { GqlRolesGuard } from 'src/roles/gql-roles.guard';
import { NotamEntity, NotamSchema } from './entities/notam.entity';
import { NotamService } from './services/notam.service';
import { NotamDto } from './dto/notam.dto';
import { NotamResolver } from './resolver/notam.resolver';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: NotamEntity.name, schema: NotamSchema },
        ]),
        NestjsQueryGraphQLModule.forFeature({
            imports: [
                NestjsQueryMongooseModule.forFeature([
                    {
                        document: NotamEntity,
                        name: NotamEntity.name,
                        schema: NotamSchema,
                    },
                ]),
            ],
            resolvers: [
                {
                    DTOClass: NotamDto,
                    EntityClass: NotamEntity,
                    guards: [GqlAuthGuard, GqlRolesGuard], // <- Add your guards here
                },
            ],
        }),
    ],
    providers: [
        NotamService,
        NotamResolver,
    ],
    exports: [NotamService],
})
export class NotamModule { }
