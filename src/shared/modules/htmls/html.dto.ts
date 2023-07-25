import { IsNotEmpty, IsString } from 'class-validator';

export class HtmlDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  html: string;
}

export class EditHtmlDto {
  @IsString()
  title?: string;

  @IsString()
  html?: string;
}
