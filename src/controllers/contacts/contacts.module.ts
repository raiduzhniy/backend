import { Module } from '@nestjs/common';
import { HtmlsModule } from '../../shared/modules/htmls';
import { ContactsController } from './contacts.controller';

@Module({
  imports: [HtmlsModule],
  controllers: [ContactsController],
})
export class ContactsModule {}
