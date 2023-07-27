import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '@shared/decorators';
import { RolesGuard } from '@shared/guards';
import { UserDto, UserUpdateDto } from './users.dto';
import { User } from './user.schema';
import { UserRole } from './users.enum';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(UserRole.Admin, UserRole.Superadmin)
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  @Roles(UserRole.Admin, UserRole.Superadmin)
  async getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Post()
  @Roles(UserRole.Superadmin)
  async createUser(@Body() userDto: UserDto): Promise<User> {
    return this.usersService.createUser(userDto);
  }

  @Put(':id')
  @Roles(UserRole.Admin, UserRole.Superadmin)
  async updateUser(
    @Param('id') id: string,
    @Body() userDto: UserUpdateDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, userDto);
  }

  @Put(':id/reset-password')
  @Roles(UserRole.Admin, UserRole.Superadmin)
  async resetPassword(@Param('id') id: string): Promise<User> {
    return this.usersService.resetPassword(id);
  }
}
