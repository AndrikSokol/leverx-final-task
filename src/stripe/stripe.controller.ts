import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { IUser } from '@/user/types/user.interface';
import { CurrentUser } from '@/decorators/current-user.decorator';

import { ApiBody, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from '@/order/dto/createOrder.dto';
import { QueryDto } from './dto/Query.dto';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  constructor(
    @Inject('STRIPE_SERVICE') private readonly stripeService: StripeService,
  ) {}

  @ApiOperation({ summary: 'create order' })
  @ApiCookieAuth('access_token')
  @ApiBody({ type: CreateOrderDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  async checkout(@Body() dto: CreateOrderDto, @CurrentUser() user: IUser) {
    const session = await this.stripeService.checkout(dto, user);
    return { url: session.url };
  }

  @ApiOperation({ summary: 'auto redirect' })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @Get('/result')
  async status(@Query() queryDto: QueryDto, @CurrentUser() user: IUser) {
    return await this.stripeService.setStatus(queryDto, user);
  }
}
