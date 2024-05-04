import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Status } from '@/enum/status.enum';
import { VinylService } from '@/vinyl/vinyl.service';
import { Vinyl } from '@/vinyl/entities/vinyl.entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject('VINYL_SERVICE') private readonly vinylService: VinylService,
  ) {}

  async createOrder(dto: CreateOrderDto, userId: number): Promise<Order> {
    const vinyls: Vinyl[] = await this.vinylService.findVinylsById(
      dto.vinylsId,
    );
    const totalPrice = vinyls.reduce((acc, curr) => acc + curr.price, 0);

    const newOrder = new Order({ userId, totalPrice });

    newOrder.vinyls = vinyls;

    return await this.orderRepository.save(newOrder);
  }

  async getOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: { user: true, vinyls: true },
      select: {
        totalPrice: true,
        status: true,
        user: { firstName: true, lastName: true, email: true },
        vinyls: true,
      },
    });
  }

  async setOrderStatus(orderId: number, status: Status): Promise<void> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    await this.orderRepository.save({ ...order, status });
  }

  async getOrder(id: number): Promise<Order> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: { vinyls: true },
    });
  }
}
