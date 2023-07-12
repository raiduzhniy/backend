import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase/app';
import { FirebaseStorageService } from './storage';
import { FirestoreService } from './firestore';

const EXPORTS = [FirebaseStorageService, FirestoreService];

@Global()
@Module({
  providers: [...EXPORTS],
  exports: [...EXPORTS],
})
export class FirebaseModule {
  constructor(configService: ConfigService) {
    initializeApp(configService.get('firebaseConfig'));
  }
}
