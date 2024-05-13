import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ITelegramOptions } from './types/telegramOptions.interface';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constants';
import { MessageDto } from './dto/message.dto';
import { readFile } from 'fs-extra';
import { ConfigService } from '@nestjs/config';
import { ParseMode } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class TelegramService {
  bot: Telegraf;
  options: ITelegramOptions;

  constructor(
    @Inject(TELEGRAM_MODULE_OPTIONS) options: ITelegramOptions,
    private readonly configService: ConfigService,
  ) {
    this.bot = new Telegraf(options.token);
    this.options = options;
  }

  async sendMessage(messageDto: MessageDto): Promise<void> {
    const message =
      `<b>Name:</b> ${messageDto.name}\n` +
      `<a href=\"${this.configService.get('BASE_URL')}/vinyl/${messageDto.link}\">Link</a>\n` +
      `<b>Price:</b> ${messageDto.price}$`;

    if (messageDto.image === null) {
      await this.bot.telegram.sendMessage(this.options.chatId, message, {
        parse_mode: 'HTML' as ParseMode,
      });
      return;
    }

    const imageFilePath = `uploads/${messageDto.image}`;

    const imageBuffer = await readFile(imageFilePath);

    await this.bot.telegram.sendPhoto(
      this.options.chatId,
      {
        source: imageBuffer,
      },
      {
        caption: message,
        parse_mode: 'HTML',
      },
    );
  }
}
