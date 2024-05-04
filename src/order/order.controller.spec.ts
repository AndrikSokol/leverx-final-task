import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

import { RolesGuard } from '@/auth/guards/roles.guard';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Order } from './entities/order.entity';

const mockOrderService = {
  getOrders: jest.fn(),
};
const mockOrder = [
  new Order({ id: 1, userId: 1, totalPrice: 15 }),
  new Order({ id: 2, userId: 2, totalPrice: 25 }),
];

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: 'ORDER_SERVICE',
          useValue: mockOrderService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>('ORDER_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOrders', () => {
    it('should return orders', async () => {
      mockOrderService.getOrders.mockResolvedValue(mockOrder);

      const result = await controller.getOrders();

      expect(result).toEqual(mockOrder);
    });
  });
});
