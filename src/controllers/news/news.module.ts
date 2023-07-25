import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { FilesMiddleware } from '@shared/middlewares';
import { ImagesModule } from '@shared/modules/images/images.module';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  imports: [ImagesModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(FilesMiddleware).forRoutes({
      path: `news/create`,
      method: RequestMethod.POST,
    });
  }
}
