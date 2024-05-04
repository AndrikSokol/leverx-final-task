import { IUser } from '../types/user.interface';

export class UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;

  constructor(model: Omit<IUser, 'passwordHash' | 'createdAt' | 'updatedAt'>) {
    this.firstName = model.firstName;
    this.lastName = model.lastName;
    this.email = model.email;
    this.id = model.id;
  }
}
