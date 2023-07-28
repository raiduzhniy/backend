import { Injectable } from '@nestjs/common';
import {
  ReceivedDocuments,
  SuccessResponse,
  TableQuery,
} from '@shared/interfaces';
import { FirestoreBase } from '@shared/modules/firebase/firestore';
import { ImagesService } from '@shared/modules/images/images.service';
import { TelegramBotService } from '@shared/modules/telegram-bot/telegram-bot.service';
import { DateUtils, DocumentsUtils } from '@shared/utils';
import { EditNewsDto, NewsDto } from './news.dto';
import { News, NewsSchema } from './news.schema';

@Injectable()
export class NewsService extends FirestoreBase<NewsSchema> {
  protected readonly collectionName: string = 'news';

  constructor(
    private imagesService: ImagesService,
    private telegramBotService: TelegramBotService,
  ) {
    super();
  }

  async createNews(newsDto: NewsDto): Promise<NewsSchema> {
    const { image, ...restDto } = newsDto;

    const storagePath = image
      ? await this.imagesService.uploadImage(image)
      : null;

    const createdAtDate = new Date();

    const news: NewsSchema = {
      ...restDto,
      storagePath,
      createdAt: createdAtDate.toISOString(),
      editedAt: null,
    };

    return this.addDoc(news).then((news) => {
      this.telegramBotService.createdNews(news.id, news.title);

      return news;
    });
  }

  async editNews(id: string, newsDto: EditNewsDto): Promise<NewsSchema> {
    const { image, ...restNews } = newsDto;
    let storagePath: string;

    if (image || image === null) {
      const existedNews = await this.getDocumentById(id);

      existedNews.storagePath &&
        (await this.imagesService
          .deleteImage(existedNews?.storagePath)
          .catch((error) => {
            if (error.code !== 'storage/object-not-found') {
              throw error;
            }
          }));

      storagePath = null;
    }

    if (image) {
      storagePath = await this.imagesService.uploadImage(image);
    }

    return this.updateDoc(id, {
      ...restNews,
      ...(storagePath || storagePath === null ? { storagePath } : {}),
      editedAt: DateUtils.nowISODate(),
    });
  }

  async deleteNews(newsId: string): Promise<SuccessResponse> {
    const { id, ...news } = await this.getDocumentById(newsId);

    try {
      await Promise.all([
        this.imagesService.deleteImage(news.storagePath),
        this.findByIdAndDelete(newsId),
      ]);

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  async getNews(queryParams?: TableQuery): Promise<ReceivedDocuments<News>> {
    const paginateQuery =
      DocumentsUtils.createBuildQueryFromQueryParams(queryParams);

    const receivedDocuments = await this.getDocuments({
      buildQuery: paginateQuery,
    });

    const newsPromises = receivedDocuments.elements.map((news) => {
      return this.transformStoragePathToUrl(news);
    });

    return {
      ...receivedDocuments,
      elements: await Promise.all(newsPromises),
    };
  }

  async getOneNews(id: string): Promise<News> {
    const news = await this.getDocumentById(id);

    return this.transformStoragePathToUrl(news);
  }

  private async transformStoragePathToUrl({
    storagePath,
    ...news
  }: NewsSchema): Promise<News> {
    return {
      ...news,
      imageUrl: storagePath
        ? await this.imagesService.getDownloadLink(storagePath)
        : null,
    } as News;
  }
}
