import { Module } from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vinyl } from './entities/vinyl.entities';
import { VinylController } from './vinyl.controller';
import { DiscogsModule } from '@/discogs/discogs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vinyl]), DiscogsModule],
  controllers: [VinylController],
  providers: [{ useClass: VinylService, provide: 'VINYL_SERVICE' }],
  exports: [{ useClass: VinylService, provide: 'VINYL_SERVICE' }],
})
export class VinylModule {}
