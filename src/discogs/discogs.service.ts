import { VINYL_NOT_FOUND } from '@/constants/response-messages';
import { PageOptionsDto } from '@/dto/pageOptions.dto';
import { FileService } from '@/file/file.service';
import { DiscogsQueryDto } from '@/vinyl/dto/discogsQuery';
import { VinylDto } from '@/vinyl/dto/vinyl.dto';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { randomInt } from 'crypto';
import { catchError, firstValueFrom } from 'rxjs';
import { API_URL } from './dicsogs.constants';
import { DiscogsResponse } from './types/discogsResponse.type';

@Injectable()
export class DiscogsService {
  constructor(
    @Inject('FILE_SERVICE') private readonly fileService: FileService,
    private readonly httpService: HttpService,
  ) {}

  async findVinyl(query: DiscogsQueryDto) {
    const TYPE = 'release';
    const { data } = await firstValueFrom(
      this.httpService
        .get<DiscogsResponse>(API_URL.databaseSeach, {
          params: {
            type: TYPE,
            release_title: query.realese_title,
            artist: query.artist,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new Error(error.message);
          }),
        ),
    );
    const vinyl = data.results[0];

    if (!vinyl) {
      throw new NotFoundException(VINYL_NOT_FOUND);
    }

    return await this.findByReleaseId(vinyl.id);
  }

  async findVinyls(query: DiscogsQueryDto, pageOptionsDto: PageOptionsDto) {
    const TYPE = 'release';
    const { data } = await firstValueFrom(
      this.httpService
        .get<DiscogsResponse>(API_URL.databaseSeach, {
          params: {
            type: TYPE,
            release_title: query.realese_title,
            artist: query.artist,
            page: pageOptionsDto.page,
            per_page: pageOptionsDto.take,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new Error(error.message);
          }),
        ),
    );

    return data.results;
  }

  async findByReleaseId(releaseId: number) {
    const { data: vinyl } = await firstValueFrom(
      this.httpService.get(API_URL.release + releaseId).pipe(
        catchError((error: AxiosError) => {
          if (error.status == 404) {
            throw new BadRequestException(VINYL_NOT_FOUND);
          } else {
            throw new Error(error.message);
          }
        }),
      ),
    );

    if (!vinyl) {
      throw new NotFoundException(VINYL_NOT_FOUND);
    }

    const dto = await this.parseData(vinyl);

    return dto;
  }

  private async parseData(vinyl) {
    const newFile = await this.fileService.saveFileByLink(vinyl.images[0].uri);

    const dto: VinylDto = {
      name: vinyl.title,
      description: vinyl.notes || 'no content',
      image: newFile.url,
      authorName: vinyl.artists_sort,
      price: randomInt(10),
    };
    return dto;
  }
}
