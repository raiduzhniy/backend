import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirestoreService {
  db: Firestore;

  constructor(configService: ConfigService) {
    initializeApp({
      credential: cert(configService.get('serviceAccount')),
    });

    this.db = getFirestore();
  }
}
