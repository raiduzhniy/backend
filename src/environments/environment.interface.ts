import { FirebaseOptions } from '@firebase/app';
import { ServiceAccount } from 'firebase-admin/lib/app/credential';

export interface Environment {
  port: number;
  apiUrl: string;
  jwtSecret: string;
  connectionString?: string;
  firebaseConfig: FirebaseOptions;
  serviceAccount: ServiceAccount;
}
