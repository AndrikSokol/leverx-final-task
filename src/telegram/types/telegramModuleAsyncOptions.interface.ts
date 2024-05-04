import { ModuleMetadata } from '@nestjs/common';
import { ITelegramOptions } from './telegramOptions.interface';

export interface ITelegramModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<ITelegramOptions> | ITelegramOptions;
  inject?: any[];
}
