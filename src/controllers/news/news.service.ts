import { Injectable } from '@nestjs/common';
import { SuccessResponse } from '@shared/interfaces';
import { FirestoreBase } from '@shared/modules/firebase/firestore';
import { ImagesService } from '@shared/modules/images/images.service';
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

    const news: NewsSchema = {
      ...restDto,
      storagePath,
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

    return this.updateDoc(id, {
      ...restNews,
      ...(storagePath ? { storagePath } : {}),
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

  async getNews(): Promise<News[]> {
    const newsWithFullPath: NewsSchema[] = await this.getDocuments();

    const newsPromises = newsWithFullPath.map(
      async ({ storagePath, ...news }) => {
        return {
          ...news,
          imageUrl: await this.imagesService.getDownloadLink(storagePath),
        } as News;
      },
    );

    return Promise.all(newsPromises);
  }
}
