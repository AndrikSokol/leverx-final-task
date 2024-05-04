import { MessageDto } from '@/telegram/dto/message.dto';
import { TelegramService } from '@/telegram/telegram.service';
import { Vinyl } from '@/vinyl/entities/vinyl.entities';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  DataSource,
} from 'typeorm';

@EventSubscriber()
export class TelegramSubscriber implements EntitySubscriberInterface<Vinyl> {
  constructor(
    dataSource: DataSource,
    private readonly telegramService: TelegramService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Vinyl;
  }

  async afterInsert(event: InsertEvent<Vinyl>) {
    const vinyl = new MessageDto(event.entity);
    await this.telegramService.sendMessage(vinyl);
  }
}
