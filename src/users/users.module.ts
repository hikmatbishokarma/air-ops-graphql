import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersResolver } from './resolvers/users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from './entities/user.entity';
import { NestjsQueryGraphQLModule } from '@app/query-graphql';
import { NestjsQueryMongooseModule } from '@app/query-mongoose';
import { UserDTO } from './dto/users.dto';
import { RolesModule } from 'src/roles/roles.module';
import { RolesService } from 'src/roles/services/roles.service';
import { NotificationModule } from 'src/notification/notification.module';
import { OperatorModule } from 'src/operator/operator.module';

@Module({
  imports: [
    RolesModule,
    NotificationModule,
    forwardRef(() => OperatorModule),
    // MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        RolesModule,
        NestjsQueryMongooseModule.forFeature([
          {
            document: UserEntity,
            name: UserEntity.name,
            schema: UserSchema,
          },
        ]),
      ],
      resolvers: [
        {
          DTOClass: UserDTO,
          EntityClass: UserEntity,
          create: { one: { disabled: true } },
        },
      ],
    }),
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
