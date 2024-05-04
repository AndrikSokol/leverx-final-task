import { Test, TestingModule } from '@nestjs/testing';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { CreateOrderDto } from '@/order/dto/createOrder.dto';
import { QueryDto } from './dto/Query.dto';
import { Status } from '@/enum/status.enum';

describe('StripeController', () => {
  let controller: StripeController;
  let stripeService: StripeService;

  const mockUser = {
    firstName: 'Andrei',
    lastName: 'Sakalouski',
    email: 'andriksokol31@gmail.com',
    id: Date.now(),
    googleId: null,
    passwordHash: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StripeController],
      providers: [
        {
          provide: 'STRIPE_SERVICE',
          useValue: {
            checkout: jest.fn(),
            setStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StripeController>(StripeController);
    stripeService = module.get<StripeService>('STRIPE_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('checkout', () => {
  //   it('should create an order and return the session URL', async () => {
  //     const mockDto: CreateOrderDto = {
  //       vinylsId: [10, 11, 12],
  //     };

  //     const mockSession = {
  //       url: 'https://example.com',
  //     };

  //     jest.spyOn(stripeService, 'checkout').mockResolvedValue({ url: 'https://example.com' });

  //     const result = await controller.checkout(mockDto, mockUser);

  //     expect(result).toEqual({ url: mockSession.url });
  //     expect(stripeService.checkout).toHaveBeenCalledWith(mockDto, mockUser);
  //   });
  // });

  // describe('setStatus', () => {
  //   it('should set the order status and send an email', async () => {
  //     const mockQueryDto: QueryDto = {
  //       status: Status.Success,
  //       orderId: 1,
  //     };

  //     jest.spyOn(stripeService, 'setStatus').mockResolvedValue(undefined);

  //     await controller.status(mockQueryDto, mockUser);

  //     expect(stripeService.setStatus).toHaveBeenCalledWith(
  //       mockQueryDto,
  //       mockUser,
  //     );
  //   });
  // });
});
