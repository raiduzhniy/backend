import { Module } from '@nestjs/common';
import { HtmlsService } from './htmls.service';

@Module({
  providers: [HtmlsService],
  exports: [HtmlsService],
})
export class HtmlsModule {}
