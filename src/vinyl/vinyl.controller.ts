import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { VinylDto } from './dto/vinyl.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/decorators/role.decorator';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PageOptionsDto } from '@/dto/pageOptions.dto';
import { FilterQueryDto } from './dto/filterQuery.dto';
import { UserRole } from '@/enum/userRole.enum';
import { DiscogsQueryDto } from './dto/discogsQuery';

@ApiTags('vinyl')
@Controller('vinyl')
export class VinylController {
  constructor(
    @Inject('VINYL_SERVICE') private readonly vinylService: VinylService,
  ) {}

  @ApiOperation({ summary: 'get vinyls with review' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async getVinyls(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.vinylService.getVinyls(pageOptionsDto);
  }

  @ApiOperation({ summary: 'get vinyls by filter query' })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('filter')
  async getFilterVinyls(@Query() filterQueryDto?: FilterQueryDto) {
    return await this.vinylService.getFilterVinyls(filterQueryDto);
  }

  @ApiOperation({ summary: 'create vinyl' })
  @ApiCookieAuth('access_token')
  @ApiBody({ type: VinylDto })
  @UseGuards(RolesGuard)
  @Roles([UserRole.Admin])
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() dto: VinylDto) {
    return await this.vinylService.create(dto);
  }

  @ApiOperation({ summary: 'update vinyl' })
  @ApiCookieAuth('access_token')
  @ApiBody({ type: VinylDto })
  @ApiParam({ name: 'id' })
  @UseGuards(RolesGuard)
  @Roles([UserRole.Admin])
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: VinylDto) {
    return await this.vinylService.update(id, dto);
  }

  @ApiOperation({ summary: 'delete vinyl' })
  @ApiCookieAuth('access_token')
  @ApiParam({ name: 'id' })
  @UseGuards(RolesGuard)
  @Roles([UserRole.Admin])
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.vinylService.delete(id);
  }

  @ApiOperation({ summary: 'get vinyl by link' })
  @ApiCookieAuth('access_token')
  @Get(':link')
  async getVinylByLink(@Param('link') link: string) {
    return await this.vinylService.getVinylByLink(link);
  }

  @ApiOperation({ summary: 'create vinyl from discogs api' })
  @ApiCookieAuth('access_token')
  @UseGuards(RolesGuard)
  @Roles([UserRole.Admin])
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('discogs')
  async createFromDiscogs(@Query() query: DiscogsQueryDto) {
    return await this.vinylService.createFromDiscogs(query);
  }

  @ApiOperation({ summary: 'create vinyl from discogs api by release id' })
  @ApiCookieAuth('access_token')
  @UseGuards(RolesGuard)
  @Roles([UserRole.Admin])
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('discogs/:releaseId')
  async createFromDiscogsById(
    @Param('releaseId', ParseIntPipe) releaseId: number,
  ) {
    return await this.vinylService.createFromDiscogsById(releaseId);
  }
}
