import { IFile } from '@shared/interfaces';
import { EditHtmlDto, HtmlDto } from '@shared/modules/htmls';
import { IsFile, IsSupportedMimeTypes } from '@shared/validators';
import { IsOptional } from 'class-validator';

const SUPPORTED_IMAGES_FORMATS = ['image/jpeg', 'image/png'];

export class NewsDto extends HtmlDto {
  @IsOptional()
  @IsFile()
  @IsSupportedMimeTypes(SUPPORTED_IMAGES_FORMATS)
  image: IFile;
}

export class EditNewsDto extends EditHtmlDto {
  @IsOptional()
  @IsFile()
  @IsSupportedMimeTypes(SUPPORTED_IMAGES_FORMATS)
  image?: IFile | null;
}
