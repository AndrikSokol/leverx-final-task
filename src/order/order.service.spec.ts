import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/createOrder.dto';
import { VinylService } from '@/vinyl/vinyl.service';
import { Vinyl } from '@/vinyl/entities/vinyl.entities';
import { Status } from '@/enum/status.enum';

const mockOrderRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
};

const mockVinylService = {
  findVinylsById: jest.fn(),
};

const mockVinyls = [
  new Vinyl({
    id: 1,
    name: 'Vinyl 1',
    description: '123',
    authorName: 'aaa',
    image: 'vinyl1.jpg',
    price: 5,
  }),
  new Vinyl({
    id: 2,
    name: 'Vinyl 2',
    description: '123',
    authorName: 'aaa',
    image: 'vinyl1.jpg',
    price: 10,
  }),
];

const mockOrder = new Order({ id: 1, userId: 1, totalPrice: 15 });

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;
  let vinylService: VinylService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: 'VINYL_SERVICE',
          useValue: mockVinylService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    vinylService = module.get<VinylService>('VINYL_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('createOrder', () => {
  //   it('should create an order', async () => {
  //     const dto: CreateOrderDto = {
  //       vinylsId: [1, 2],
  //     };
  //     const userId = 1;
  //     const totalPrice = 15;
  //     const newOrder = new Order({ userId, totalPrice });

  //     jest.spyOn(vinylService, 'findVinylsById').mockResolvedValue(mockVinyls);
  //     mockOrderRepository.save.mockResolvedValue(newOrder);

  //     const result = await service.createOrder(dto, userId);

  //     expect(vinylService.findVinylsById).toHaveBeenCalledWith(dto.vinylsId);
  //     expect(mockOrderRepository.save).toHaveBeenCalledWith(newOrder);
  //     expect(result).toEqual(newOrder);
  //   });
  // });

  describe('getOrders', () => {
    it('should return orders with related entities', async () => {
      mockOrderRepository.find.mockResolvedValue(mockOrder);

      const result = await service.getOrders();

      expect(mockOrderRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });
  });

  describe('setOrderStatus', () => {
    it('should set order status', async () => {
      const orderId = 1;
      const status = Status.Success;

      mockOrderRepository.findOneBy.mockResolvedValue(mockOrder);

      await service.setOrderStatus(orderId, status);

      expect(mockOrderRepository.findOneBy).toHaveBeenCalledWith({
        id: orderId,
      });
      expect(mockOrderRepository.save).toHaveBeenCalledWith({
        ...mockOrder,
        status,
      });
    });
  });

  describe('getOrder', () => {
    it('should return order by id with related entities', async () => {
      const orderId = 1;

      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.getOrder(orderId);

      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderId },
        relations: { vinyls: true },
      });
      expect(result).toEqual(mockOrder);
    });
  });
});
