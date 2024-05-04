import { TELEGRAM_TOKEN_NOT_FOUND } from '@/constants/response-messages';
import { ITelegramOptions } from '@/telegram/types/telegramOptions.interface';
import { ConfigService } from '@nestjs/config';

export const getTelegramConfig = async (
  configService: ConfigService,
): Promise<ITelegramOptions> => {
  const token = configService.get('TELEGRAM_TOKEN');
  if (!token) {
    throw new Error(TELEGRAM_TOKEN_NOT_FOUND);
  }
  return {
    token,
    chatId: configService.get('TELEGRAM_CHAT_ID'),
  };
};
