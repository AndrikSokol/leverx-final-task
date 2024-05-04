import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ReviewDto } from './dto/review.dto';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/decorators/role.decorator';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { CurrentUserId } from '@/decorators/current-user-id.decorator';
import { PageOptionsDto } from '@/dto/pageOptions.dto';
import { UserRole } from '@/enum/userRole.enum';

@ApiTags('review')
@Controller('review')
export class ReviewController {
  constructor(
    @Inject('REVIEW_SERVICE') private readonly reviewService: ReviewService,
  ) {}

  @ApiOperation({ summary: 'get reviews of vinyl' })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('vinyl/:vinylId')
  async getReviewsForVinyl(
    @Param('vinylId', ParseIntPipe) vinylId: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return await this.reviewService.getReviewsForVinyl(vinylId, pageOptionsDto);
  }

  @ApiOperation({ summary: 'get all reviews' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async getReviews(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.reviewService.getReviews(pageOptionsDto);
  }

  @ApiOperation({ summary: 'create review' })
  @ApiCookieAuth('access_token')
  @ApiBody({ type: ReviewDto })
  @UseGuards(RolesGuard)
  @Roles([UserRole.User])
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() dto: ReviewDto, @CurrentUserId() userId: number) {
    return await this.reviewService.create(dto, userId);
  }

  @ApiOperation({ summary: 'delete review' })
  @ApiCookieAuth('access_token')
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @Roles([UserRole.Admin])
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.reviewService.delete(id);
  }
}
