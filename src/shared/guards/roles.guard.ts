import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../modules/users/users.enum';
import { UsersService } from '../../modules/users/users.service';

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

    // TODO [Komoff] get user from request cookies(bearer token)
    // const user = await this.usersService.getUser('user id from JWT token from request here');

    return this.matchRoles(roles, []);
  }

  private matchRoles(roles: UserRole[], userRoles: UserRole[]): boolean {
    const userRolesMap = userRoles.reduce((obj, curr) => {
      obj[curr] = true;

      return obj;
    }, {});

    return true;
    // return roles.some((role) => userRolesMap[role]);
  }
}
