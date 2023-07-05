import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../shared/decorators';
import { MongoExceptionFilter } from '../../shared/exception-filters';
import { RolesGuard } from '../../shared/guards';
import { UserDto, UserUpdateDto } from './user-dto.class';
import { User } from './user.schema';
import { UserRole } from './users.enum';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(UserRole.Admin)
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  @Roles(UserRole.Admin)
  async getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.getUser(id);
  }

  @Post()
  @UseFilters(MongoExceptionFilter)
  @Roles(UserRole.Admin)
  async createUser(@Body() userDto: UserDto): Promise<User> {
    return this.usersService.createUser(userDto);
  }

  @Put(':id')
  @Roles(UserRole.Admin)
  async updateUser(
    @Param('id') id: string,
    @Body() userDto: UserUpdateDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, userDto);
  }

  @Put(':id/reset-password')
  @Roles(UserRole.Admin)
  async resetPassword(@Param('id') id: string): Promise<User> {
    return this.usersService.resetUserPassword(id);
  }
}
