import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

import { Roles } from '@/decorators/role.decorator';
import { UserRole } from '@/enum/userRole.enum';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@/auth/guards/roles.guard';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(
    @Inject('ORDER_SERVICE') private readonly orderService: OrderService,
  ) {}

  @ApiOperation({ summary: 'get all orders of vinyls' })
  @ApiCookieAuth('access_token')
  @UseGuards(RolesGuard)
  @Roles([UserRole.Admin])
  @UseGuards(JwtAuthGuard)
  @Get()
  async getOrders() {
    return await this.orderService.getOrders();
  }
}
