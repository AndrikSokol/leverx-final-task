import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from '@/order/order.module';
import { EmailModule } from '@/email/email.module';

@Module({
  imports: [ConfigModule, OrderModule, EmailModule],
  controllers: [StripeController],
  providers: [{ useClass: StripeService, provide: 'STRIPE_SERVICE' }],
})
export class StripeModule {}
