import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/users/users.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
