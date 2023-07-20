import { Body, Get, Put } from '@nestjs/common';
import { HtmlDto, HtmlSchema, HtmlsService } from '../modules/htmls';
import { UserRole } from '../../controllers/users/users.enum';
import { IsPublicRequest, Roles } from '../decorators';

export abstract class HtmlsControllerBase {
  protected abstract readonly docId: string;

  protected constructor(private htmlsService: HtmlsService) {}

  @Put('edit')
  @Roles(UserRole.Admin)
  async editDoc(@Body() aboutUsDto: HtmlDto): Promise<HtmlSchema> {
    return this.htmlsService.editDoc(this.docId, aboutUsDto);
  }

  @Get()
  @IsPublicRequest()
  async getDoc(): Promise<HtmlSchema> {
    return this.htmlsService.getDocumentById(this.docId);
  }
}
