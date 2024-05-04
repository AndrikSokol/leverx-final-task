import { Test, TestingModule } from '@nestjs/testing';
import { VinylService } from './vinyl.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vinyl } from './entities/vinyl.entities';
import { EntityManager } from 'typeorm';
import { PageDto } from '@/dto/page.dto';
import { PageMetaDto } from '@/dto/pageMeta.dto';
import { PageOptionsDto } from '@/dto/pageOptions.dto';
import { FilterQueryDto } from './dto/filterQuery.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { VinylDto } from './dto/vinyl.dto';
import * as vinylUtils from '@/utils/isExistsFIle';

const mockVinyls = [
  {
    id: 1,
    name: 'Vinyl 1',
    description: '123',
    authorName: 'aaa',
    image: 'vinyl1.jpg',
    price: 5,
  },
  {
    id: 2,
    name: 'Vinyl 2',
    description: '123',
    authorName: 'aaa',
    image: 'vinyl1.jpg',
    price: 10,
  },
];

describe('VinylService', () => {
  let service: VinylService;
  let vinylRepository: Repository<Vinyl>;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VinylService,
        {
          provide: getRepositoryToken(Vinyl),
          useClass: Repository,
        },
        {
          provide: EntityManager,
          useClass: EntityManager,
        },
      ],
    }).compile();

    service = module.get<VinylService>(VinylService);
    vinylRepository = module.get<Repository<Vinyl>>(getRepositoryToken(Vinyl));
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getVinyls', () => {
    it('should return a page of vinyls with metadata', async () => {
      jest.spyOn(entityManager, 'query').mockResolvedValue(mockVinyls);
      jest.spyOn(vinylRepository, 'count').mockResolvedValue(mockVinyls.length);

      const pageOptionsDto: PageOptionsDto = { page: 1, skip: 10 };
      const result = await service.getVinyls(pageOptionsDto);

      const expectedMeta = new PageMetaDto({
        itemCount: mockVinyls.length,
        pageOptionsDto,
      });
      expect(result).toEqual(new PageDto(mockVinyls, expectedMeta));
    });
  });

  describe('getFilterVinyls', () => {
    it('should return filtered vinyls', async () => {
      const filterQueryDto: FilterQueryDto = { name: 'vinyl 1' };
      jest.spyOn(entityManager, 'query').mockResolvedValue(mockVinyls);

      const result = await service.getFilterVinyls(filterQueryDto);

      expect(result).toEqual(mockVinyls);
    });
  });

  describe('create', () => {
    const mockVinyl: VinylDto = mockVinyls[0];
    it('should create a new vinyl', async () => {
      const isExistsFileMock = jest
        .spyOn(vinylUtils, 'isExistsFile')
        .mockResolvedValue(true);

      jest.spyOn(vinylRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(vinylRepository, 'save')
        .mockResolvedValue(new Vinyl(mockVinyl));

      const result = await service.create(new Vinyl(mockVinyl));

      expect(isExistsFileMock).toHaveBeenCalledWith(mockVinyl.image);
      expect(result.id).toEqual(1);
    });

    it('should throw an error if vinyl with the same name already exists', async () => {
      jest
        .spyOn(vinylRepository, 'findOne')
        .mockResolvedValue(new Vinyl(mockVinyl));

      await expect(service.create(mockVinyls[0])).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    const mockVinyl1: VinylDto = mockVinyls[0];
    const mockVinyl2: VinylDto = mockVinyls[1];
    const dto = mockVinyl2;

    it('should update the vinyl', async () => {
      jest
        .spyOn(vinylRepository, 'findOneBy')
        .mockResolvedValue(new Vinyl(mockVinyl1));
      jest
        .spyOn(vinylRepository, 'save')
        .mockResolvedValue(new Vinyl({ ...mockVinyl1, ...dto }));

      const id = 1;
      const result = await service.update(id, dto);

      expect(result).toBeInstanceOf(Vinyl);
    });

    it('should throw NotFoundException if vinyl does not exist', async () => {
      jest.spyOn(vinylRepository, 'findOneBy').mockResolvedValue(null);

      const id = 1;
      await expect(service.update(id, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete the vinyl', async () => {
      jest
        .spyOn(vinylRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      const id = 1;
      const result = await service.delete(id);

      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if vinyl does not exist', async () => {
      jest.spyOn(vinylRepository, 'delete').mockResolvedValue(null);

      const id = 1;
      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
    });
  });
});
