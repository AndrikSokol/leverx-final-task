import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { PageOptionsDto } from '@/dto/pageOptions.dto';
import { ReviewDto } from './dto/review.dto';
import { Review } from './entities/review.entities';
import { PageMetaDto } from '@/dto/pageMeta.dto';
import { PageDto } from '@/dto/page.dto';

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

describe('ReviewController', () => {
  let controller: ReviewController;
  let reviewService: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        {
          provide: 'REVIEW_SERVICE',
          useValue: {
            getReviewsForVinyl: jest.fn(),
            getReviews: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
    reviewService = module.get<ReviewService>('REVIEW_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getReviewsForVinyl', () => {
    const pageOptionsDto: PageOptionsDto = { page: 1, skip: 0, take: 10 };
    const expectedMeta = new PageMetaDto({
      itemCount: mockReviews.length,
      pageOptionsDto,
    });

    it('should return reviews for a vinyl', async () => {
      const vinylId = 1;

      jest
        .spyOn(reviewService, 'getReviewsForVinyl')
        .mockResolvedValueOnce(new PageDto(mockReviews, expectedMeta));

      const result = await controller.getReviewsForVinyl(
        vinylId,
        pageOptionsDto,
      );

      expect(result.data).toEqual(mockReviews);
    });
  });

  describe('getReviews', () => {
    const pageOptionsDto: PageOptionsDto = { page: 1, skip: 0, take: 10 };
    const expectedMeta = new PageMetaDto({
      itemCount: mockReviews.length,
      pageOptionsDto,
    });

    it('should return all reviews', async () => {
      jest
        .spyOn(reviewService, 'getReviews')
        .mockResolvedValueOnce(new PageDto(mockReviews, expectedMeta));

      const result = await controller.getReviews(pageOptionsDto);

      expect(result.data).toEqual(mockReviews);
    });
  });

  describe('create', () => {
    it('should create a new review', async () => {
      const reviewDto: ReviewDto = {
        comment: 'Great vinyl!',
        score: 5,
        vinylId: 1,
      };
      const userId = 1;
      const createdReview = new Review(reviewDto);
      createdReview.id = 1;
      createdReview.userId = userId;
      jest.spyOn(reviewService, 'create').mockResolvedValueOnce(createdReview);

      const result = await controller.create(reviewDto, userId);

      expect(result).toEqual(mockReviews[0]);
    });
  });

  describe('delete', () => {
    it('should delete a review', async () => {
      const id = 1;
      jest.spyOn(reviewService, 'delete').mockResolvedValueOnce();

      const result = await controller.delete(id);

      expect(result).toBeUndefined();
    });
  });
});
