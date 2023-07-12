import { Injectable } from '@nestjs/common';
import { FirestoreBase, FirestoreService } from '../firebase/firestore';
import { Owner } from './owner.schema';

@Injectable()
export class OwnersService extends FirestoreBase<Owner> {
  protected readonly collectionName: string = 'owners';

  constructor(firestoreService: FirestoreService) {
    super(firestoreService);
  }
}
