import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './configs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { GqlConfigService } from './configs/gql-config.service';
import { RolesModule } from './roles/roles.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { AircraftCategoriesModule } from './aircraft-categories/aircraft-categories.module';
import { AirportsModule } from './airports/airports.module';
import { ClientsModule } from './clients/clients.module';
import { QuotesModule } from './quotes/quotes.module';
import { PriceModule } from './price/price.module';
import { RepresentativeModule } from './representative/representative.module';
import { ResourceModule } from './resource/resource.module';
import { NotificationModule } from './notification/notification.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AircraftDetailModule } from './aircraft-detail/aircraft-detail.module';
import { CityModule } from './city/city.module';
import { MediaModule } from './media/media.module';
import { AgentModule } from './operator/operator.module';
import { CrewDetailModule } from './crew-details/crew-detail.module';
import { ManualModule } from './manual/manual.module';
import { LeaveModule } from './leaves/leave.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RolesModule,
    RolePermissionModule,
    AircraftCategoriesModule,
    AircraftDetailModule,
    AirportsModule,
    ClientsModule,
    QuotesModule,
    PriceModule,
    RepresentativeModule,
    ResourceModule,
    NotificationModule,
    DashboardModule,
    CityModule,
    MediaModule,
    AgentModule,
    CrewDetailModule,
    ManualModule,
    LeaveModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // ignoreEnvFile: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
