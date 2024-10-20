import { graphql } from 'graphql';
import { mongo } from 'mongoose';
import { Config } from './config.interface';

const config: any = {
  cors: { enable: true },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.gql',
    sortSchema: true,
  },
  mongo: {
    uri: process.env.MONGODB_URI,
  },
  server: {
    port: Number(process.env.PORT),
  },
};
export default (): Config => config;
