import { Injectable } from '@nestjs/common';
import {
  ReceivedDocuments,
  SuccessResponse,
  TableQuery,
} from '@shared/interfaces';
import { FirestoreBase } from '@shared/modules/firebase/firestore';
import { ImagesService } from '@shared/modules/images/images.service';
import { DocumentsUtils } from '@shared/utils';
import { EditNewsDto, NewsDto } from './news.dto';
import { News, NewsSchema } from './news.schema';

@Injectable()
export class NewsService extends FirestoreBase<NewsSchema> {
  protected readonly collectionName: string = 'news';

  constructor(private imagesService: ImagesService) {
    super();
  }

  async createNews(newsDto: NewsDto): Promise<NewsSchema> {
    const { image, ...restDto } = newsDto;

    const storagePath = await this.imagesService.uploadImage(image);

    const createdAtDate = new Date();

    const news: NewsSchema = {
      ...restDto,
      storagePath,
      createdAt: createdAtDate.toISOString(),
    };

    return this.addDoc(news);
  }

  async editNews(id: string, newsDto: EditNewsDto): Promise<NewsSchema> {
    const { image, ...restNews } = newsDto;
    let storagePath: string;

    if (image) {
      const existedNews = await this.getDocumentById(id);

      await this.imagesService.deleteImage(existedNews.storagePath);

      storagePath = await this.imagesService.uploadImage(image);
    }

    const editedAt = new Date();

    return this.updateDoc(id, {
      ...restNews,
      ...(storagePath ? { storagePath } : {}),
      editedAt: editedAt.toISOString(),
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

    const newsPromises = receivedDocuments.elements.map(
      async ({ storagePath, ...news }) => {
        return {
          ...news,
          imageUrl: await this.imagesService.getDownloadLink(storagePath),
        } as News;
      },
    );

    return {
      ...receivedDocuments,
      elements: await Promise.all(newsPromises),
    };
  }
}
