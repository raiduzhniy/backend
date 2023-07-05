import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VehicleType } from './vehicles.enum';

export class VehicleDto {
  @IsEnum(VehicleType)
  @IsNotEmpty()
  type: VehicleType;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @IsOptional()
  @IsString()
  model?: string;
}
