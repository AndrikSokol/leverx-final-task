import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { OrderService } from '@/order/order.service';
import { EmailService } from '@/email/email.service';
import Stripe from 'stripe';
import { CreateOrderDto } from '@/order/dto/createOrder.dto';
import { User } from '@/user/entities/user.entity';
import { QueryDto } from './dto/Query.dto';
import { Status } from '@/enum/status.enum';

const mockConfigService = {
  get: jest.fn((key: string) => {
    switch (key) {
      case 'STRIPE_SECRET_KEY':
        return 'mock_secret_key';
      case 'BASE_URL':
        return 'http://mock.base.url';
      default:
        return undefined;
    }
  }),
};

const mockOrderService = {
  createOrder: jest.fn(),
  setOrderStatus: jest.fn(),
  getOrder: jest.fn(),
};

const mockEmailService = {
  send: jest.fn(),
};

// const mockStripeSession: Stripe.Response<Stripe.Checkout.Session> = {
//   id: 'mock_session_id',
//   object: 'checkout.session',
//   after_expiration: null,
//   allow_promotion_codes: false,
//   amount_subtotal: 0,
//   amount_total: 0,
//   automatic_tax: null,
//   billing_address_collection: null,
//   cancel_url: 'http://example.com/cancel',
//   client_reference_id: 'mock_client_reference_id',
// };

const mockUser: User = new User({
  id: 1,
  firstName: 'andrei',
  lastName: 'sokol',
  email: 'test@example.com',
  passwordHash: 'password',
});

const mockQuery: QueryDto = { status: Status.Proccess, orderId: 1 };

const mockOrderDto: CreateOrderDto = {
  vinylsId: [10, 11],
};

describe('StripeService', () => {
  let service: StripeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: OrderService, useValue: mockOrderService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('checkout', () => {
  //   it('should create a checkout session and return it', async () => {
  //     mockOrderService.createOrder.mockResolvedValueOnce(mockOrderDto);

  //     jest.spyOn(service['stripe'].checkout.sessions, 'create');

  //     const result = await service.checkout(mockOrderDto, mockUser);

  //     expect(result).toBeDefined();
  //     expect(mockOrderService.createOrder).toHaveBeenCalledWith(
  //       mockOrderDto,
  //       mockUser.id,
  //     );
  //     expect(service['stripe'].checkout.sessions.create).toHaveBeenCalledWith({
  //       line_items: expect.any(Array),
  //       mode: 'payment',
  //       success_url:
  //         'http://mock.base.url/stripe/result?status=success&orderId=mock_order_id',
  //       cancel_url:
  //         'http://mock.base.url/stripe/result?status=canceled&orderId=mock_order_id',
  //     });
  //   });

  //   it('should throw BadRequestException if order is not created', async () => {
  //     mockOrderService.createOrder.mockResolvedValueOnce(undefined);

  //     await expect(
  //       service.checkout(mockOrderDto, mockUser),
  //     ).rejects.toThrowError(BadRequestException);
  //   });
  // });

  // describe('setStatus', () => {
  //   it('should set order status and send email successfully', async () => {
  //     mockOrderService.setOrderStatus.mockResolvedValueOnce(null);
  //     mockOrderService.getOrder.mockResolvedValueOnce(mockOrderDto);

  //     await service.setStatus(mockQuery, mockUser);

  //     // expect(mockOrderService.setOrderStatus).toHaveBeenCalledWith(
  //     //   QueryDto,
  //     //   mockOrderDto,
  //     // );
  //     // expect(mockOrderService.getOrder).toHaveBeenCalledWith(mockOrderDto);
  //     // expect(mockEmailService.send).toHaveBeenCalledWith();

  //     expect(mockOrderService.setOrderStatus).toHaveBeenCalledWith(
  //       mockQuery.orderId,
  //       mockQuery.status,
  //     );
  //     expect(mockOrderService.getOrder).toHaveBeenCalledWith(mockQuery.orderId);
  //     expect(mockEmailService.send).toHaveBeenCalledWith(
  //       {
  //         to: mockUser.email,
  //         subject: `Dear ${mockUser.firstName} ${mockUser.lastName}`,
  //       },
  //       mockQuery.status,
  //       mockOrderDto,
  //     );
  //   });
  // });
});
