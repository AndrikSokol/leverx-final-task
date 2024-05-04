import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Review } from './entities/review.entities';
import { Repository } from 'typeorm';
import { ReviewDto } from './dto/review.dto';
import { VinylService } from '@/vinyl/vinyl.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from '@/dto/pageMeta.dto';
import { PageDto } from '@/dto/page.dto';
import { PageOptionsDto } from '@/dto/pageOptions.dto';
import {
  REVIEW_NOT_FOUND,
  VINYL_NOT_FOUND,
} from '@/constants/response-messages';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @Inject('VINYL_SERVICE') private readonly vinylService: VinylService,
  ) {}

  async getReviews(pageOptionsDto: PageOptionsDto): Promise<PageDto<Review>> {
    const reviews = await this.reviewRepository.find({
      relations: { user: true },
      select: {
        id: true,
        comment: true,
        score: true,
        user: { firstName: true, lastName: true, email: true },
      },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
      order: {
        id: 'ASC',
      },
    });

    const itemCount = await this.reviewRepository.count();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(reviews, pageMetaDto);
  }

  async getReviewsForVinyl(
    vinylId: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Review>> {
    const reviews = await this.reviewRepository.find({
      where: { vinylId },
      relations: { user: true },
      select: {
        id: true,
        comment: true,
        score: true,
        user: { firstName: true, lastName: true, email: true },
      },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
      order: {
        id: 'ASC',
      },
    });

    const itemCount = await this.reviewRepository.count({ where: { vinylId } });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(reviews, pageMetaDto);
  }

  async create(dto: ReviewDto, userId: number): Promise<Review> {
    const vinyl = await this.vinylService.findVinylById(dto.vinylId);

    if (!vinyl) {
      throw new NotFoundException(VINYL_NOT_FOUND);
    }

    const existingReview = await this.reviewRepository.findOne({
      where: { vinylId: dto.vinylId, userId },
    });

    if (existingReview) {
      return await this.reviewRepository.save({
        id: existingReview.id,
        ...dto,
        userId,
      });
    } else {
      const review = new Review({ ...dto, userId });
      return await this.reviewRepository.save(review);
    }
  }

  async delete(id: number): Promise<void> {
    const deletedReview = await this.reviewRepository.delete({ id });

    if (!deletedReview) {
      throw new NotFoundException(REVIEW_NOT_FOUND);
    }
  }
}
