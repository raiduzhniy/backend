import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../modules/users/users.enum';
import { UsersService } from '../../modules/users/users.service';
import { TokenUtils } from '../utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tokenPayload = TokenUtils.getTokenPayload(request);

    const user = await this.usersService.getUserById(tokenPayload.id);

    if (this.matchRoles(roles, user.roles)) {
      return true;
    }

    throw new ForbiddenException('Недостатньо прав для виконання операції');
  }

  private matchRoles(roles: UserRole[], userRoles: UserRole[]): boolean {
    const userRolesMap = userRoles.reduce((obj, curr) => {
      obj[curr] = true;

      return obj;
    }, {});

    return roles.some((role) => userRolesMap[role]);
  }
}
