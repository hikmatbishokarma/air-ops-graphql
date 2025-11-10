export interface Config {
  cors: CorsConfig;
  graphql: GraphqlConfig;
  mongo?: MongoConfig;
  server?: ServerConfig;
  url: string;
  api_url: string;
  email: EmailConfig;
  multer_dest?: any;
  s3: any;
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

export interface ServerConfig {
  port: number;
}

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  secure: boolean;
}
