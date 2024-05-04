import { Status } from '@/enum/status.enum';

export interface IOrder {
  id: number;
  userId: number;
  totalPrice: number;
  status: Status;
}
