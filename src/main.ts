import { NestFactory } from '@nestjs/core';

import { cert, initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { initializeApp as initializeFirebaseApp } from 'firebase/app';
import { setupApplication } from '../app.config';
import { AppModule } from './app.module';

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

(async () => {
  const app = setupApplication(
    await NestFactory.create(AppModule, { bufferLogs: true }),
  );

  await app.listen(3333);
})();
