import { Test, TestingModule } from '@nestjs/testing';
import { TelegramService } from './telegram.service';
import { Telegraf } from 'telegraf';
import { ITelegramOptions } from './types/telegramOptions.interface';
import { ConfigService } from '@nestjs/config';
import { MessageDto } from './dto/message.dto';

const mockTelegramOptions: ITelegramOptions = {
  token: 'mock_token',
  chatId: 'mock_chat_id',
};

const mockConfigService = {
  get: jest.fn(() => 'mock_base_url'),
};

const mockMessageDto: MessageDto = {
  name: 'Mock Vinyl',
  link: 'mock-vinyl',
  price: 10,
  image: 'mock-image.jpg',
};

jest.mock('telegraf', () => ({
  Telegraf: jest.fn(() => ({
    telegram: {
      sendPhoto: jest.fn(),
    },
  })),
}));

jest.mock('fs-extra', () => ({
  readFile: jest.fn(() => Buffer.from('mock_image_buffer')),
}));

describe('TelegramService', () => {
  let service: TelegramService;
  let telegrafInstance: Telegraf;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegramService,
        {
          provide: 'TELEGRAM_MODULE_OPTIONS',
          useValue: mockTelegramOptions,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TelegramService>(TelegramService);
    telegrafInstance = (service as any).bot;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should send message with photo', async () => {
      await service.sendMessage(mockMessageDto);

      expect(telegrafInstance.telegram.sendPhoto).toHaveBeenCalledWith(
        mockTelegramOptions.chatId,
        {
          source: Buffer.from('mock_image_buffer'),
        },
        {
          caption: expect.any(String),
          parse_mode: 'HTML',
        },
      );
    });
  });
});
