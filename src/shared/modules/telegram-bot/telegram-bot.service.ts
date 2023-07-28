import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Message } from 'node-telegram-bot-api';
import * as TelegramBot from 'node-telegram-bot-api';

let TELEGRAM_BOT: TelegramBot;

@Injectable()
export class TelegramBotService {
  private readonly bot: TelegramBot;

  private readonly groupId: number = this.configService.get('telegramGroupId');

  private readonly frontendBaseUrl: string =
    this.configService.get('frontendBaseUrl');

  constructor(private configService: ConfigService) {
    /**
     * @description
     * To avoid duplication of initialization of TelegramBot
     * Because of Firebase functions is serverless approach Firebase runs application from the beginning every request
     */
    if (!TELEGRAM_BOT) {
      TELEGRAM_BOT = new TelegramBot(
        this.configService.get('telegramBotToken'),
        { polling: true },
      );
    }
    this.bot = TELEGRAM_BOT;
  }

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
