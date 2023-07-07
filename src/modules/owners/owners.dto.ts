import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OwnerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phoneNumbers?: string[];
}
