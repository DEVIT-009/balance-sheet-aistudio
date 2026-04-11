export interface Expense {
  id: string;
  date: string;
  price: number;
  delivery: number;
  total: number;
  image: string;
  description: string;
  is_transfer: boolean;
  transfer_to: string;
  transfer_at: string;
  transfer_image: string
}
