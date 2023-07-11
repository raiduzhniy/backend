import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firestore } from 'firebase-admin';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import Firestore = firestore.Firestore;
import DocumentReference = firestore.DocumentReference;

@Injectable()
export class FirestoreService {
  private readonly db: Firestore;

  constructor(configService: ConfigService) {
    initializeApp({
      credential: cert(configService.get('serviceAccountCred')),
    });

    this.db = getFirestore();
  }

  addDoc<T>(collection: string, doc: T): Promise<DocumentReference> {
    const collectionRef = this.db.collection(collection);

    return collectionRef.add(doc);
  }
}
