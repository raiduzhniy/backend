import { Firestore, getFirestore } from '@firebase/firestore';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirestoreService {
  db: Firestore;

  constructor(configService: ConfigService) {
    this.db = getFirestore();
  }
}
