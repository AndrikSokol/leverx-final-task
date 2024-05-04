import { Status } from '@/enum/status.enum';
import { User } from '@/user/entities/user.entity';
import { Vinyl } from '@/vinyl/entities/vinyl.entities';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Vinyl, (vinyl) => vinyl.orders)
  @JoinTable()
  vinyls: Vinyl[];

  @Column({ name: 'total_price' })
  totalPrice: number;

  @Column({ enum: Status, default: Status.Proccess })
  status: Status;

  constructor(partial: Partial<Order>) {
    Object.assign(this, partial);
  }
}
