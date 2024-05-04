import { IUser } from '@/user/types/user.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { OrderService } from '@/order/order.service';
import { CreateOrderDto } from '@/order/dto/createOrder.dto';
import { EmailService } from '@/email/email.service';
import { ORDER_NOT_CREATED } from '@/constants/response-messages';
import { QueryDto } from './dto/Query.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject('ORDER_SERVICE') private readonly orderService: OrderService,
    private readonly emailService: EmailService,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-04-10',
    });
  }

  async checkout(
    dto: CreateOrderDto,
    user: IUser,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const order = await this.orderService.createOrder(dto, user.id);

    if (!order) {
      throw new BadRequestException(ORDER_NOT_CREATED);
    }

    const lineItems = order.vinyls.map((vinyl) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: vinyl.name,
            images: [
              `${this.configService.get('BASE_URL')}/static/${vinyl.image}`,
            ],
          },
          unit_amount: vinyl.price * 100,
        },
        quantity: 1,
      };
    });

    const success_url: string =
      this.configService.get('BASE_URL') +
      '/stripe/result?status=success&orderId=' +
      order.id;

    const cancel_url: string =
      this.configService.get('BASE_URL') +
      '/stripe/result?status=canceled&orderId=' +
      order.id;

    const session = await this.stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url,
      cancel_url,
    });
    return session;
  }

  async setStatus(
    { status, orderId }: QueryDto,
    { lastName, firstName, email }: IUser,
  ): Promise<void> {
    await this.orderService.setOrderStatus(orderId, status);

    const order = await this.orderService.getOrder(orderId);

    const vinylsName = order.vinyls.map((vinyl) => vinyl.name).join(' ');

    const emailData = {
      to: email,
      subject: `Dear ${firstName} ${lastName}`,
    };

    await this.emailService.send(
      emailData,
      status,
      vinylsName,
      order.totalPrice,
    );
  }
}
