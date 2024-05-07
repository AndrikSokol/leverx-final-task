import { Test, TestingModule } from '@nestjs/testing';
import { DiscogsService } from './discogs.service';
import { HttpService } from '@nestjs/axios';

import { FileService } from '@/file/file.service';

describe('DiscogsService', () => {
  let service: DiscogsService;
  let httpService: HttpService;
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscogsService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: 'FILE_SERVICE',
          useValue: {
            saveFileByLink: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DiscogsService>(DiscogsService);
    httpService = module.get<HttpService>(HttpService);
    fileService = module.get<FileService>('FILE_SERVICE');
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  it('should be defined httpService', () => {
    expect(httpService).toBeDefined();
  });

  it('should be defined fileService', () => {
    expect(fileService).toBeDefined();
  });
});
