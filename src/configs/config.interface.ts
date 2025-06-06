export interface Config {
  cors: CorsConfig;
  graphql: GraphqlConfig;
  mongo?: MongoConfig;
}
export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
  introspection: boolean;
}
export interface CorsConfig {
  enabled: boolean;
}

export interface MongoConfig {
  uri: string;
}
