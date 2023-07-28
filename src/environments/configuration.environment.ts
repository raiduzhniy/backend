import { Environment } from './environment.interface';

export default (): Environment => ({
  port: 3333,
  apiUrl: '/v1',
  jwtSecret: process.env.JWT_SECRET,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramGroupId: +process.env.TELEGRAM_GROUP_ID,
  frontendBaseUrl: process.env.FRONTEND_BASE_URL,
});
