import { User } from '@/user/entities/user.entity';
import { Vinyl } from '@/vinyl/entities/vinyl.entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'review' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column()
  score: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'vinyl_id' })
  vinylId: number;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Vinyl, (vinyl) => vinyl.reviews)
  @JoinColumn({ name: 'vinyl_id' })
  vinyl: Vinyl;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: Partial<Review>) {
    Object.assign(this, partial);
  }
}
