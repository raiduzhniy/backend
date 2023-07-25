import { IFile } from '@shared/interfaces';
import { HtmlDto } from '@shared/modules/htmls';
import { IsFile, IsSupportedMimeTypes } from '@shared/validators';
import { IsOptional } from 'class-validator';

export class NewsDto extends HtmlDto {
  @IsOptional()
  @IsFile()
  @IsSupportedMimeTypes(['image/jpeg', 'image/png'])
  image: IFile;
}
