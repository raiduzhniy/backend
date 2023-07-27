import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Message } from 'node-telegram-bot-api';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramBotService {
  private readonly bot = new TelegramBot(
    this.configService.get('telegramBotToken'),
    { polling: true },
  );

  private readonly groupId: number = this.configService.get('telegramGroupId');

  private readonly frontendBaseUrl: string =
    this.configService.get('frontendBaseUrl');

  constructor(private configService: ConfigService) {}

  createdNews(newsId: string, newsTitle: string): Promise<Message> {
    return this.sendMessage(this.createNewsMessage(newsId, newsTitle));
  }

  sendMessage(message: string): Promise<Message> {
    return this.bot.sendMessage(this.groupId, message, {
      parse_mode: 'HTML',
    });
  }

  private createNewsMessage(newsId: string, newsTitle: string): string {
    return `<b>Новина на нашому сайті</b> \n <a href="${this.frontendBaseUrl}/news/${newsId}">${newsTitle}</a>`;
  }
}
