import { Injectable } from '@nestjs/common';
import { FirestoreBase, FirestoreService } from '../firebase/firestore';
import { Vehicle } from './vehicle.schema';

@Injectable()
export class VehiclesService extends FirestoreBase<Vehicle> {
  protected readonly collectionName: string = 'vehicles';
  constructor(firestoreService: FirestoreService) {
    super(firestoreService);
  }
}
