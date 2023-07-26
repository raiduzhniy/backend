import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { IsPublicRequest, Roles } from '@shared/decorators';
import { RolesGuard } from '@shared/guards';
import {
  ReceivedDocuments,
  SuccessResponse,
  TableQuery,
} from '@shared/interfaces';
import { UserRole } from '../users/users.enum';
import { EditNewsDto, NewsDto } from './news.dto';
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

  @Put(':id/edit')
  @Roles(UserRole.Admin, UserRole.Superadmin)
  async edit(
    @Body() newsDto: EditNewsDto,
    @Param('id') id: string,
  ): Promise<NewsSchema> {
    return this.newsService.editNews(id, newsDto);
  }

  @Delete(':id/delete')
  @Roles(UserRole.Admin, UserRole.Superadmin)
  async deleteNews(@Param('id') id: string): Promise<SuccessResponse> {
    return this.newsService.deleteNews(id);
  }

  @Get()
  @IsPublicRequest()
  async getNews(
    @Query() queryParams?: TableQuery,
  ): Promise<ReceivedDocuments<News>> {
    return this.newsService.getNews(queryParams);
  }
}
