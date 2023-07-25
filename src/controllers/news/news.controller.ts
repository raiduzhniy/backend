import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IsPublicRequest, Roles } from '@shared/decorators';
import { RolesGuard } from '@shared/guards';
import { SuccessResponse } from '@shared/interfaces';
import { UserRole } from '../users/users.enum';
import { NewsDto } from './news.dto';
import { News, NewsSchema } from './news.schema';
import { NewsService } from './news.service';

@Controller('news')
@UseGuards(RolesGuard)
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Post('create')
  @Roles(UserRole.Admin, UserRole.Superadmin)
  async createNews(@Body() newsDto: NewsDto): Promise<NewsSchema> {
    return this.newsService.createNews(newsDto);
  }

  @Delete(':id/delete')
  @Roles(UserRole.Admin, UserRole.Superadmin)
  async deleteNews(@Param('id') id: string): Promise<SuccessResponse> {
    return this.newsService.deleteNews(id);
  }

  @Get()
  @IsPublicRequest()
  async getNews(): Promise<News[]> {
    return this.newsService.getNews();
  }
}
