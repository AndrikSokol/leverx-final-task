import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Profile } from './profile/entities/profile.entity';
import { Review } from './review/entities/review.entities';
import { Order } from './order/entities/order.entity';
import { Vinyl } from './vinyl/entities/vinyl.entities';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'dpg-core6l21hbls73f4n53g-a',
  database: 'hwfinal_ipqk_user',
  port: 5432,
  username: 'hwfinal_user',
  password: 'elHykGvHgnpqZ54PzCoF8cvf2KMAoJYW',
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
