import {
  Controller,
  Get,
  Inject,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DiscogsService } from './discogs.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { DiscogsQueryDto } from '@/vinyl/dto/discogsQuery';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '@/dto/pageOptions.dto';

@ApiTags('discogs')
@Controller('discogs')
export class DiscogsController {
  constructor(
    @Inject('DISCOGS_SERVICE') private readonly discogsService: DiscogsService,
  ) {}

  @ApiOperation({ summary: 'find vinyls from discogs api' })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get()
  async findVinyls(
    @Query() queryDto: DiscogsQueryDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return await this.discogsService.findVinyls(queryDto, pageOptionsDto);
  }
}
