import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { IsPublicRequest } from '../../shared/decorators';
import { SuccessResponse } from '../../shared/interfaces';
import { TokenUtils } from '../../shared/utils';
import { User } from '../users';
import { AuthDto, ChangePasswordDto } from './auth.dto';
import { SuccessfulLoginDto } from './auth.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('user')
  async getUser(@Req() request: Request): Promise<User> {
    const tokenPayload = TokenUtils.getTokenPayload(request);

    return this.authService.getUser(tokenPayload.id);
  }

  @Post('login')
  @IsPublicRequest()
  async login(@Body() authDto: AuthDto): Promise<SuccessfulLoginDto> {
    return this.authService.login(authDto);
  }

  @Put('confirm-user-agreement')
  async confirmUserAgreement(
    @Req() request: Request,
  ): Promise<SuccessResponse> {
    const tokenPayload = TokenUtils.getTokenPayload(request);

    return this.authService.confirmUserAgreement(tokenPayload.id);
  }

  @Put('change-password')
  async changePassword(
    @Req() request: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    const tokenPayload = TokenUtils.getTokenPayload(request);

    return this.authService.changePassword(tokenPayload, changePasswordDto);
  }
}
