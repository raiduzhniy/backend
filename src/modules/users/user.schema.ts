import { SchemaBase } from '../../shared/abstract-classes';
import { Owner } from '../owners';
import { Vehicle } from '../vehicles';
import { UserRole } from './users.enum';

export class User extends SchemaBase {
  login: string;
  passwordHash?: string;
  roles: UserRole[];
  apartmentNumber?: number;
  owners?: (Owner | string)[];
  vehicles?: (Vehicle | string)[];
}
