import { Order } from '@/order/entities/order.entity';
import { Review } from '@/review/entities/review.entities';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'vinyl' })
export class Vinyl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ name: 'author_name' })
  authorName: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  link: string;

  @OneToMany(() => Review, (review) => review.vinyl, { onDelete: 'CASCADE' })
  reviews: Review[];

  @ManyToMany(() => Order, (order) => order.vinyls, { onDelete: 'SET NULL' })
  orders: Order[];

  @BeforeInsert()
  async generateLink() {
    this.link = uuidv4();
  }

  constructor(partial: Partial<Vinyl>) {
    Object.assign(this, partial);
  }
}
