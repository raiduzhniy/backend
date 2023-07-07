import { Body, Controller, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { IsPublicRequest } from '../../shared/decorators';
import { User } from '../users';
import { AuthDto, ChangePasswordDto } from './auth.dto';
import { SuccessfulLoginDto, TokenPayload } from './auth.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @IsPublicRequest()
  async login(@Body() authDto: AuthDto): Promise<SuccessfulLoginDto> {
    return this.authService.login(authDto);
  }

  @Put('change-password')
  async changePassword(
    @Req() request: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    const tokenPayload: TokenPayload = request['tokenPayload'];

    return this.authService.changePassword(tokenPayload, changePasswordDto);
  }
}
