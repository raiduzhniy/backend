import { Request } from 'express';
import { TokenPayload } from '../../modules/auth/auth.interface';

export const TOKEN_PAYLOAD_KEY = 'tokenPayload';

export class TokenUtils {
  static getTokenPayload(request: Request): TokenPayload {
    return request[TOKEN_PAYLOAD_KEY];
  }
}
