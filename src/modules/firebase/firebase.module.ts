import { Global, Module } from '@nestjs/common';
import { FirebaseStorageService } from './storage';
import { FirestoreService } from './firestore';

const EXPORTS = [FirebaseStorageService, FirestoreService];

@Global()
@Module({
  providers: [...EXPORTS],
  exports: [...EXPORTS],
})
export class FirebaseModule {}
