import { Controller, UseGuards } from '@nestjs/common';
import { HtmlsControllerBase } from '../../shared/abstract-classes';
import { RolesGuard } from '../../shared/guards';
import { HtmlsService } from '../../shared/modules/htmls';

@Controller('about-us')
@UseGuards(RolesGuard)
export class AboutUsController extends HtmlsControllerBase {
  protected readonly docId: string = 'about-us';

  constructor(htmlsService: HtmlsService) {
    super(htmlsService);
  }
}
