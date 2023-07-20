import { Controller } from '@nestjs/common';
import { HtmlsControllerBase } from '../../shared/abstract-classes';
import { HtmlsService } from '../../shared/modules/htmls';

@Controller('contacts')
export class ContactsController extends HtmlsControllerBase {
  protected readonly docId: string = 'contacts';
  constructor(htmlsService: HtmlsService) {
    super(htmlsService);
  }
}
