import { User } from '../users';

export interface TokenPayload {
  login: string;
  id: string;
}

export interface SuccessfulLoginDto {
  user: User;
  token: string;
}
