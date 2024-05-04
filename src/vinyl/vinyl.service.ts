import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Vinyl } from './entities/vinyl.entities';
import { EntityManager, In, IsNull, Not, Repository } from 'typeorm';
import { VinylDto } from './dto/vinyl.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterQueryDto } from './dto/filterQuery.dto';
import { PageOptionsDto } from '@/dto/pageOptions.dto';
import { PageMetaDto } from '@/dto/pageMeta.dto';
import { PageDto } from '@/dto/page.dto';
import { isExistsFile } from '@/utils/isExistsFIle';
import {
  IMAGE_NOT_FOUND,
  VINYL_ALREADY_EXISTS_WITH_SAME_NAME,
  VINYL_NOT_FOUND,
} from '@/constants/response-messages';

@Injectable()
export class VinylService {
  constructor(
    @InjectRepository(Vinyl)
    private readonly vinylRepository: Repository<Vinyl>,
    private readonly entityManager: EntityManager,
  ) {}

  async getVinyls(pageOptionsDto: PageOptionsDto): Promise<PageDto<Vinyl[]>> {
    const query = `
    SELECT v.name,
    v.author_name,
    v.description,
    v.price,
    r.score AS first_review_score,
    r.comment AS first_review_comment,
    AVG(rv.score) AS avg_score
FROM vinyl v
  JOIN review r ON v.id = r.vinyl_id
  JOIN (
 SELECT vinyl_id, MIN(updated_at) AS first_review_date
 FROM review
 GROUP BY vinyl_id
) AS first_review ON r.vinyl_id = first_review.vinyl_id AND r.updated_at = first_review.first_review_date
  JOIN review rv ON v.id = rv.vinyl_id
GROUP BY v.name, v.author_name, v.description, v.price, r.score, r.comment
ORDER BY v.name ${pageOptionsDto.order}
LIMIT ${pageOptionsDto.take} OFFSET ${pageOptionsDto.skip};
`;

    const vinyls = await this.entityManager.query(query);
    const itemCount = await this.vinylRepository.count({
      where: { reviews: { id: Not(IsNull()) } },
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(vinyls, pageMetaDto);
  }

  async getFilterVinyls(filterQueryDto: FilterQueryDto) {
    let query = `SELECT * FROM vinyl v `;
    const conditions = [];

    if (filterQueryDto?.name) {
      conditions.push(
        `LOWER(v.name) LIKE '%${filterQueryDto.name.toLocaleLowerCase()}%'`,
      );
    }
    if (filterQueryDto?.authorName) {
      conditions.push(
        `LOWER(v.author_name) LIKE '%${filterQueryDto.authorName.toLocaleLowerCase()}%'`,
      );
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const orderConditions = [];

    if (filterQueryDto.orderPrice) {
      orderConditions.push(`price ${filterQueryDto.orderPrice}`);
    }
    if (filterQueryDto.orderName) {
      orderConditions.push(`name ${filterQueryDto.orderName}`);
    }
    if (filterQueryDto.orderAuthorName) {
      orderConditions.push(`author_name ${filterQueryDto.orderAuthorName}`);
    }

    if (orderConditions.length > 0) {
      query += ` ORDER BY ${orderConditions.join(', ')}`;
    }

    return await this.entityManager.query(query);
  }

  async create(dto: VinylDto): Promise<Vinyl> {
    const existingVinyl = await this.vinylRepository.findOne({
      where: { name: dto.name },
    });

    if (existingVinyl) {
      throw new BadRequestException(VINYL_ALREADY_EXISTS_WITH_SAME_NAME);
    }

    if (!(await isExistsFile(dto.image))) {
      throw new NotFoundException(IMAGE_NOT_FOUND);
    }

    const newVinyl = new Vinyl({ ...dto });

    return await this.vinylRepository.save(newVinyl);
  }

  async update(id: number, dto: VinylDto) {
    const vinyl: Vinyl | null = await this.vinylRepository.findOneBy({ id });

    if (!vinyl) {
      throw new NotFoundException(VINYL_NOT_FOUND);
    }

    return await this.vinylRepository.save({ ...vinyl, ...dto });
  }

  async delete(id: number) {
    const deletedVinyl = await this.vinylRepository.delete({ id });

    if (!deletedVinyl) {
      throw new NotFoundException(VINYL_NOT_FOUND);
    }
  }

  async findVinylById(id: number) {
    return await this.vinylRepository.findOneBy({ id });
  }
  async findVinylsById(ids: number[]) {
    return await this.vinylRepository.find({ where: { id: In(ids) } });
  }

  async getVinylByLink(link: string) {
    return await this.vinylRepository.findOne({ where: { link } });
  }
}
