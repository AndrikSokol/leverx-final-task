import { Test, TestingModule } from '@nestjs/testing';
import { DiscogsController } from './discogs.controller';
import { DiscogsService } from './discogs.service';
import { DiscogsQueryDto } from '@/vinyl/dto/discogsQuery';
import { PageOptionsDto } from '@/dto/pageOptions.dto';

describe('DiscogsController', () => {
  let controller: DiscogsController;
  let service: DiscogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscogsController],
      providers: [
        {
          provide: 'DISCOGS_SERVICE',
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DiscogsController>(DiscogsController);
    service = module.get<DiscogsService>('DISCOGS_SERVICE');
  });

  describe('findVinyl', () => {
    it('should return vinyl records from Discogs', async () => {
      const queryDto: DiscogsQueryDto = { realese_title: ' nirvana' };
      const pageOptionsDto: PageOptionsDto = { page: 1, skip: 0, take: 10 };
      const expectedResponse = [{ realese_title: ' nirvana' }];

      jest.spyOn(service, 'find').mockResolvedValue(expectedResponse);

      const result = await controller.findVinyl(queryDto, pageOptionsDto);

      expect(result).toEqual(expectedResponse);
    });
  });
});
