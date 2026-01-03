import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { GqlRolesGuard } from 'src/roles/gql-roles.guard';
import { NoticeBoardEntity, NoticeBoardSchema } from './entities/notice-board.entity';
import { NoticeBoardService } from './services/notice-board.service';
import { NoticeBoardDto } from './dto/notice-board.dto';
import { NoticeBoardResolver } from './resolvers/notice-board.resolver';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: NoticeBoardEntity.name, schema: NoticeBoardSchema },
        ]),
        NestjsQueryGraphQLModule.forFeature({
            imports: [
                NestjsQueryMongooseModule.forFeature([
                    {
                        document: NoticeBoardEntity,
                        name: NoticeBoardEntity.name,
                        schema: NoticeBoardSchema,
                    },
                ]),
            ],
            resolvers: [
                {
                    DTOClass: NoticeBoardDto,
                    EntityClass: NoticeBoardEntity,
                    guards: [GqlAuthGuard, GqlRolesGuard],
                },
            ],
        }),
    ],
    providers: [
        NoticeBoardService,
        NoticeBoardResolver,
    ],
    exports: [NoticeBoardService],
})
export class NoticeBoardModule { }
