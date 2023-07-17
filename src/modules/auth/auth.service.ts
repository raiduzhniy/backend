import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users';
import { UsersService } from '../users/users.service';
import { AuthDto, ChangePasswordDto } from './auth.dto';
import { SuccessfulLoginDto, TokenPayload } from './auth.interface';

const INCORRECT_USER_OR_PASSWORD_EXCEPTION = new UnauthorizedException(
  'Incorrect login or password',
);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async getUser(userId: string): Promise<User> {
    return this.usersService.getUserById(userId);
  }

  async login({ login, password }: AuthDto): Promise<SuccessfulLoginDto> {
    const user = await this.usersService.getUserByLogin(login);

    if (!user) {
      throw INCORRECT_USER_OR_PASSWORD_EXCEPTION;
    }

    const isPasswordCorrect = await this.isPasswordCorrect(
      password,
      user.passwordHash,
    );

    if (!isPasswordCorrect) {
      throw INCORRECT_USER_OR_PASSWORD_EXCEPTION;
    }

    const token = await this.createToken({ login, id: user.id });

    return {
      token,
      user: {
        login: user.login,
        roles: user.roles,
        owners: user.owners,
        vehicles: user.vehicles,
        id: user.id,
        apartmentNumber: user.apartmentNumber,
      },
    };
  }

  async changePassword(
    tokenPayload: TokenPayload,
    { password, newPassword, confirmPassword }: ChangePasswordDto,
  ): Promise<User> {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.usersService.getUserById(tokenPayload.id, []);

    const isPasswordCorrect = await this.isPasswordCorrect(
      password,
      user.passwordHash,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException('Incorrect current password');
    }

    return this.usersService.changePassword(user.id, newPassword);
  }

  private createToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  private isPasswordCorrect(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
