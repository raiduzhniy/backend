import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../../modules/auth/auth.interface';
import { TOKEN_PAYLOAD_KEY } from '../utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublicRequest(context)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const secret = this.configService.get('jwtSecret');

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      (request[TOKEN_PAYLOAD_KEY] as TokenPayload) =
        await this.jwtService.verifyAsync(token, {
          secret,
        });
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isPublicRequest(context: ExecutionContext): boolean {
    return this.reflector.get<boolean>('isPublicRequest', context.getHandler());
  }
}
