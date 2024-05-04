import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entities';
import { VinylService } from '@/vinyl/vinyl.service';
import { PageDto } from '@/dto/page.dto';
import { PageMetaDto } from '@/dto/pageMeta.dto';
import { PageOptionsDto } from '@/dto/pageOptions.dto';
import { NotFoundException } from '@nestjs/common';

const mockReviews = [
  new Review({
    id: 1,
    comment: 'Great vinyl!',
    score: 5,
    userId: 1,
    vinylId: 1,
  }),
  new Review({
    id: 2,
    comment: 'Nice!',
    score: 4,
    userId: 2,
    vinylId: 1,
  }),
];

describe('ReviewService', () => {
  let service: ReviewService;
  let reviewRepository: Repository<Review>;
  let vinylService: VinylService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getRepositoryToken(Review),
          useClass: Repository,
        },
        {
          provide: 'VINYL_SERVICE',
          useValue: {
            findVinylById: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    reviewRepository = module.get<Repository<Review>>(
      getRepositoryToken(Review),
    );
    vinylService = module.get<VinylService>('VINYL_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getReviews', () => {
    it('should return a page of reviews with metadata', async () => {
      jest.spyOn(reviewRepository, 'find').mockResolvedValue(mockReviews);
      jest
        .spyOn(reviewRepository, 'count')
        .mockResolvedValue(mockReviews.length);

      const pageOptionsDto: PageOptionsDto = { page: 1, skip: 0, take: 10 };
      const result = await service.getReviews(pageOptionsDto);

      const expectedMeta = new PageMetaDto({
        itemCount: mockReviews.length,
        pageOptionsDto,
      });
      expect(result).toEqual(new PageDto(mockReviews, expectedMeta));
    });
  });

  describe('getReviewsForVinyl', () => {
    it('should return a page of reviews for a vinyl with metadata', async () => {
      jest.spyOn(reviewRepository, 'find').mockResolvedValue(mockReviews);
      jest
        .spyOn(reviewRepository, 'count')
        .mockResolvedValue(mockReviews.length);

      const vinylId = 1;
      const pageOptionsDto: PageOptionsDto = { page: 1, skip: 0, take: 10 };
      const result = await service.getReviewsForVinyl(vinylId, pageOptionsDto);

      const expectedMeta = new PageMetaDto({
        itemCount: mockReviews.length,
        pageOptionsDto,
      });
      expect(result).toEqual(new PageDto(mockReviews, expectedMeta));
    });
  });

  describe('create', () => {
    const mockReview = mockReviews[0];
    it('should create a new review', async () => {
      jest.spyOn(reviewRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(reviewRepository, 'save')
        .mockResolvedValue(new Review(mockReview));

      const result = await service.create(mockReview, 1);

      expect(result.id).toEqual(1);
    });

    it('should update an existing review', async () => {
      jest.spyOn(reviewRepository, 'findOne').mockResolvedValue(mockReview);
      jest
        .spyOn(reviewRepository, 'save')
        .mockResolvedValue(new Review(mockReview));

      const result = await service.create(mockReview, 1);

      expect(result.id).toEqual(1);
    });

    it('should throw TypeError if vinyl does not exist', async () => {
      jest.spyOn(reviewRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(mockReview, 1)).rejects.toThrow(TypeError);
    });
  });

  describe('delete', () => {
    it('should delete the review', async () => {
      jest
        .spyOn(reviewRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      const id = 1;
      const result = await service.delete(id);

      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if review does not exist', async () => {
      jest.spyOn(reviewRepository, 'delete').mockResolvedValue(null);

      const id = 1;
      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
    });
  });
});
