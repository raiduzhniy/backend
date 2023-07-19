import { Global, Module } from '@nestjs/common';
import { FirebaseStorageService } from './storage';

const EXPORTS = [FirebaseStorageService];

@Global()
@Module({
  providers: [...EXPORTS],
  exports: [...EXPORTS],
})
export class FirebaseModule {}
