export interface Environment {
  port: number;
  apiUrl: string;
  jwtSecret: string;
  telegramBotToken: string;
  telegramGroupId: number;
  frontendBaseUrl: string;
}
