import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Express } from 'express';
import * as express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import * as process from 'process';
import { AppModule } from './src/app.module';
import { initializeApp as initializeAdminApp, cert } from 'firebase-admin/app';
import { initializeApp as initializeFirebaseApp } from 'firebase/app';

initializeFirebaseApp({
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DATABASE_URL,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
  appId: process.env.FB_APP_ID,
});

initializeAdminApp({
  credential: cert({
    projectId: process.env.FB_PROJECT_ID,
    clientEmail: process.env.FB_CLIENT_EMAIL,
    privateKey: process.env.FB_PRIVATE_KEY,
  }),
});

const expressServer = express();
const createFunction = async (expressInstance: Express): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  const configService: ConfigService = app.get(ConfigService);
  const prefix = configService.get('apiUrl');

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix(prefix);

  await app.init();
};
export const api = onRequest(
  { region: 'europe-central2' },
  async (request, response) => {
    await createFunction(expressServer);
    expressServer(request, response);
  },
);
