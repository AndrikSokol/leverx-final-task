import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Profile } from './profile/entities/profile.entity';
import { Review } from './review/entities/review.entities';
import { Order } from './order/entities/order.entity';
import { Vinyl } from './vinyl/entities/vinyl.entities';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'dpg-cu02ueq3esus73aebq50-a',
  database: 'hwfinal_kmop',
  port: 5432,
  username: 'hwfinal_kmop_user',
  password: 'VvsUhe8sVLo2egqPqCJswkSN9ffGMiMz',
  synchronize: false,
  entities: [User, Profile, Review, Order, Vinyl],
  migrations: ['src/migrations/*{.ts,.js}'],
});

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default dataSource;
