import { Order } from '../../../shared/models/order.model';

export interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
}

export const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};
