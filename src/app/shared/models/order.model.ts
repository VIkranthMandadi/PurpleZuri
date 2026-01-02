export type OrderStatus = 'shopping' | 'stitching' | 'shipping' | 'paid';

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  fabric: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface CreateOrderRequest {
  customer_name: string;
  phone: string;
  fabric: string;
  status?: OrderStatus;
}