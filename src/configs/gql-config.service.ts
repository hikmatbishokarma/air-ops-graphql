import { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { GraphqlConfig } from './config.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private configService: ConfigService) {}
  createGqlOptions(): ApolloDriverConfig {
    const graphqlConfig = this.configService.get<GraphqlConfig>('graphql');
    return {
      autoSchemaFile: graphqlConfig.schemaDestination || './src/schema.gql',
      sortSchema: graphqlConfig.sortSchema,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      installSubscriptionHandlers: true,
      debug: graphqlConfig.debug,
      playground: graphqlConfig.playgroundEnabled,
      context: ({ req }) => ({ req }),
    };
  }
}
