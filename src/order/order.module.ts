import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { VinylModule } from '@/vinyl/vinyl.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), VinylModule],
  controllers: [OrderController],
  providers: [{ useClass: OrderService, provide: 'ORDER_SERVICE' }],
  exports: [{ useClass: OrderService, provide: 'ORDER_SERVICE' }],
})
export class OrderModule {}
