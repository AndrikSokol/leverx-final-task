export interface IReview {
  id: number;
  comment: string;
  score: number;
  userId: number;
  vinylId: number;
  createdAt: Date;
  updatedAt: Date;
}
