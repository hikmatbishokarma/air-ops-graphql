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
    uri:
      process.env.MONGODB_URI ||
      'mongodb+srv://hikmat:HikmatKitchen12%23@cloud-kitchen.pvjig.mongodb.net/air-ops',
  },
  server: {
    port: Number(process.env.PORT),
  },
  url: process.env.URL,
  email: {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    secure: process.env.EMAIL_SECURE,
  },
};
export default (): Config => config;
