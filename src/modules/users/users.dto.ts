import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OwnerDto } from '../owners';
import { VehicleDto } from '../vehicles';
import { UserAddress, UserRole } from './users.enum';

export class UserUpdateDto {
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => OwnerDto)
  owners?: OwnerDto[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => VehicleDto)
  vehicles?: VehicleDto[];

  @IsNotEmpty()
  @IsEnum(UserAddress)
  address?: UserAddress;
}

export class UserDto extends UserUpdateDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  apartmentNumber: number;
}
