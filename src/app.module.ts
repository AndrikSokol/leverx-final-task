import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ReviewModule } from './review/review.module';
import { OrderModule } from './order/order.module';
import { FileModule } from './file/file.module';
import { StripeModule } from './stripe/stripe.module';
import { LogModule } from './log/log.module';
import { TelegramModule } from './telegram/telegram.module';
import { getTelegramConfig } from './configs/telegram.config';
import { VinylModule } from './vinyl/vinyl.module';
import { TelegramSubscriber } from './subscribers/TelegramSubscriber';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env` }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ProfileModule,
    ReviewModule,
    VinylModule,
    OrderModule,
    FileModule,
    StripeModule,
    LogModule,
    TelegramModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTelegramConfig,
    }),
  ],
  controllers: [],
  providers: [TelegramSubscriber],
})
export class AppModule {}
