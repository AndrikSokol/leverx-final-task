import { Module } from '@nestjs/common';
import { DiscogsService } from './discogs.service';
import { DiscogsController } from './discogs.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { FileModule } from '@/file/file.module';
import { getDiscogsConfig } from '@/configs/discogs.config';

@Module({
  imports: [
    ConfigModule,
    FileModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getDiscogsConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [DiscogsController],
  providers: [{ useClass: DiscogsService, provide: 'DISCOGS_SERVICE' }],
  exports: [{ useClass: DiscogsService, provide: 'DISCOGS_SERVICE' }],
})
export class DiscogsModule {}
