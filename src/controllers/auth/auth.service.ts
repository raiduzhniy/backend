import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SuccessResponse } from '../../shared/interfaces';
import { User } from '../users';
import { UsersService } from '../users/users.service';
import { AuthDto, ChangePasswordDto } from './auth.dto';
import { SuccessfulLoginDto, TokenPayload } from './auth.interface';

const INCORRECT_USER_OR_PASSWORD_EXCEPTION = new UnauthorizedException(
  'Неправильний логін чи пароль',
);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async confirmUserAgreement(userId): Promise<SuccessResponse> {
    return this.usersService.confirmUserAgreement(userId);
  }

  async getUser(userId: string): Promise<User> {
    return this.usersService.getUserById(userId, ['passwordHash', 'lastLogin']);
  }

  async login({ login, password }: AuthDto): Promise<SuccessfulLoginDto> {
    const { passwordHash, lastLogin, ...user } =
      await this.usersService.getUserByLogin(login);

    if (!user) {
      throw INCORRECT_USER_OR_PASSWORD_EXCEPTION;
    }

    const isPasswordCorrect = await this.isPasswordCorrect(
      password,
      passwordHash,
    );

    if (!isPasswordCorrect) {
      throw INCORRECT_USER_OR_PASSWORD_EXCEPTION;
    }

    const token = await this.createToken({ login, id: user.id });

    this.usersService.updateLastLogin(user.id);

    return {
      token,
      user,
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
