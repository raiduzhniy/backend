import { Module } from '@nestjs/common';
import { HtmlsModule } from '../../shared/modules/htmls';
import { AboutUsController } from './about-us.controller';

@Module({
  imports: [HtmlsModule],
  controllers: [AboutUsController],
})
export class AboutUsModule {}
