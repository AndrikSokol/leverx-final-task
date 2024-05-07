import { Test, TestingModule } from '@nestjs/testing';
import { VinylController } from './vinyl.controller';
import { VinylService } from './vinyl.service';
import { PageOptionsDto } from '@/dto/pageOptions.dto';
import { PageDto } from '@/dto/page.dto';
import { PageMetaDto } from '@/dto/pageMeta.dto';
import { Vinyl } from './entities/vinyl.entities';
import { FilterQueryDto } from './dto/filterQuery.dto';
import { VinylDto } from './dto/vinyl.dto';

const mockVinyls = [
  new Vinyl({
    id: 1,
    name: 'Vinyl 1',
    description: '123',
    authorName: 'aaa',
    image: 'vinyl1.jpg',
    price: 5,
  }),
  new Vinyl({
    id: 2,
    name: 'Vinyl 2',
    description: '123',
    authorName: 'aaa',
    image: 'vinyl1.jpg',
    price: 10,
  }),
];

const filterQueryDto: FilterQueryDto = { name: 'Vinyl 1' };

describe('VinylController', () => {
  let controller: VinylController;
  let service: VinylService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VinylController],
      providers: [
        {
          provide: 'VINYL_SERVICE',
          useValue: {
            getVinyls: jest.fn(),
            getFilterVinyls: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getVinylByLink: jest.fn(),
            createFromDiscogs: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VinylController>(VinylController);
    service = module.get<VinylService>('VINYL_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getVinyls', () => {
    it('should return vinyls with page options', async () => {
      const pageOptionsDto: PageOptionsDto = { skip: 10, page: 1 };

      const expectedMeta = new PageMetaDto({
        itemCount: mockVinyls.length,
        pageOptionsDto,
      });

      jest
        .spyOn(service, 'getVinyls')
        .mockResolvedValue(new PageDto([mockVinyls], expectedMeta));

      const result = await controller.getVinyls(pageOptionsDto);

      expect(result.data[0]).toEqual(mockVinyls);
    });
  });

  describe('getFilterVinyls', () => {
    it('should return filtered vinyls', async () => {
      jest.spyOn(service, 'getFilterVinyls').mockResolvedValue(mockVinyls);

      const result = await controller.getFilterVinyls(filterQueryDto);

      expect(result).toEqual(mockVinyls);
    });
  });

  describe('create', () => {
    it('should create a new vinyl', async () => {
      const vinylDto: VinylDto = {
        name: 'Vinyl 1',
        description: '123',
        authorName: 'aaa',
        image: 'vinyl1.jpg',
        price: 5,
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockVinyls[0]);

      const result = await controller.create(vinylDto);

      expect(result).toEqual(mockVinyls[0]);
    });
  });

  describe('update', () => {
    it('should update an existing vinyl', async () => {
      const id = 1;
      const vinylDto: VinylDto = {
        name: 'Vinyl 1',
        description: '123',
        authorName: 'aaa',
        image: 'vinyl1.jpg',
        price: 5,
      };

      jest.spyOn(service, 'update').mockResolvedValue(mockVinyls[0]);

      const result = await controller.update(id, vinylDto);

      expect(result).toEqual(mockVinyls[0]);
    });
  });

  describe('delete', () => {
    it('should delete a vinyl', async () => {
      const id = 1;

      jest.spyOn(service, 'delete').mockResolvedValue(null);

      const result = await controller.delete(id);

      expect(result).toBeNull();
    });
  });

  describe('getVinylByLink', () => {
    it('should return vinyl by link', async () => {
      const link = 'some-link';

      jest.spyOn(service, 'getVinylByLink').mockResolvedValue(mockVinyls[0]);

      const result = await controller.getVinylByLink(link);

      expect(result).toEqual(mockVinyls[0]);
    });
  });
});
