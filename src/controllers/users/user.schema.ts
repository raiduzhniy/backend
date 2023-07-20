import { SchemaBase } from '../../shared/abstract-classes';
import { Owner } from '../../shared/modules/owners';
import { Vehicle } from '../../shared/modules/vehicles';
import { UserAddress, UserRole } from './users.enum';

export class User extends SchemaBase {
  login: string;
  passwordHash?: string;
  roles: UserRole[];
  apartmentNumber?: number;
  owners?: (Owner | string)[];
  vehicles?: (Vehicle | string)[];
  confirmedUserAgreement: boolean;
  lastLogin?: number | null;
  address?: UserAddress;
}
