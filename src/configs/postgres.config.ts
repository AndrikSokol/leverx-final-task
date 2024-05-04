import DatabaseLogger from '@/log/databaseLogger';
import { Order } from '@/order/entities/order.entity';
import { Profile } from '@/profile/entities/profile.entity';
import { Review } from '@/review/entities/review.entities';
import { User } from '@/user/entities/user.entity';
import { Vinyl } from '@/vinyl/entities/vinyl.entities';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getPostgresConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions | TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: +configService.get('DB_PORT'),
    username: configService.get('POSTGRESQL_USERNAME'),
    password: configService.get('POSTGRESQL_PASSWORD'),
    database: configService.get('POSTGRESQL_DATABASE'),
    entities: [User, Profile, Review, Order, Vinyl],
    logger: new DatabaseLogger(),
    synchronize: false,
    // logging: true,
  };
};
