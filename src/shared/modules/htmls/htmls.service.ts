import { Injectable } from '@nestjs/common';
import { FirestoreBase } from '../firebase/firestore';
import { HtmlDto } from './html.dto';
import { HtmlSchema } from './html.schema';

@Injectable()
export class HtmlsService extends FirestoreBase<HtmlSchema> {
  protected readonly collectionName: string = 'htmls';

  async editDoc(docId: string, htmlDto: HtmlDto): Promise<HtmlSchema> {
    return this.setDocData(docId, htmlDto);
  }
}
