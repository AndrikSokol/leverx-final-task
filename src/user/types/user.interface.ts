export interface IUser {
  id: number;
  googleId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
