import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import * as process from 'process';
import { AppModule } from './src/app.module';
import { initializeApp, cert } from 'firebase-admin/app';

initializeApp({
  credential: cert({
    projectId: process.env.FB_PROJECT_ID,
    clientEmail: process.env.FB_CLIENT_EMAIL,
    privateKey: process.env.FB_PRIVATE_KEY,
  }),
});

const expressServer = express();
const createFunction = async (expressInstance): Promise<void> => {
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
  { cors: true, region: 'europe-central2' },
  async (request, response) => {
    await createFunction(expressServer);
    expressServer(request, response);
  },
);
