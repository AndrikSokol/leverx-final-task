import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Profile } from './profile/entities/profile.entity';
import { Review } from './review/entities/review.entities';
import { Order } from './order/entities/order.entity';
import { Vinyl } from './vinyl/entities/vinyl.entities';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'dpg-cor9g5fsc6pc73dlhcgg-a',
  database: 'hwfinal',
  port: 5432,
  username: 'hwfinal_user',
  password: 'fCGnWyxhPQU1MIlcAokj4HtkVEHOP6eN',
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
