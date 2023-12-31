import { SchemaBase } from '../../abstract-classes';
import { VehicleType } from './vehicles.enum';

export class Vehicle extends SchemaBase {
  type: VehicleType;
  brand: string;
  plateNumber: string;
  model?: string;
}
