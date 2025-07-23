// import { graphql } from 'graphql';
// import { mongo } from 'mongoose';
import { Config } from './config.interface';

// const config: any = {
//   cors: { enable: true },
//   graphql: {
//     playgroundEnabled: true,
//     debug: true,
//     schemaDestination: './src/schema.gql',
//     sortSchema: true,
//     introspection: true,
//   },
//   mongo: {
//     uri:
//       process.env.MONGODB_URI ||
//       'mongodb+srv://hikmat:HikmatKitchen12%23@cloud-kitchen.pvjig.mongodb.net/air-ops',
//   },
//   server: {
//     port: Number(process.env.PORT),
//   },
//   url: process.env.URL,
//   email: {
//     host: process.env.EMAIL_HOST,
//     port: Number(process.env.EMAIL_PORT),
//     user: process.env.EMAIL_USER,
//     password: process.env.EMAIL_PASS,
//     secure: process.env.EMAIL_SECURE,
//   },
//   multer_dest: {
//     dest: process.env.MULTER_DEST,
//   },
//   site_url: process.env.SITE_BASE_URL,
// };

// console.log(
//   'DEBUG (config.ts): process.env.MONGODB_URI =',
//   process.env.MONGODB_URI,
// );
// export default (): Config => config;

export default (): Config => ({
  cors: { enabled: true },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.gql',
    sortSchema: true,
    introspection: true,
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
    secure: process.env.EMAIL_SECURE === 'true',
  },
  multer_dest: {
    dest: process.env.MULTER_DEST,
  },
  site_url: process.env.SITE_BASE_URL, // fine here if ConfigModule is properly initialized
});
