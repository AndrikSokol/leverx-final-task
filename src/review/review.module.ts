import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entities';
import { VinylModule } from '@/vinyl/vinyl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), VinylModule],
  controllers: [ReviewController],
  providers: [{ provide: 'REVIEW_SERVICE', useClass: ReviewService }],
})
export class ReviewModule {}
