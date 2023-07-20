import { IsNotEmpty, IsString } from 'class-validator';

export class HtmlDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  html: string;
}
