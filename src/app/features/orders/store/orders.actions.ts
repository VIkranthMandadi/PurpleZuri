import { createAction, props } from '@ngrx/store';
import { Order, CreateOrderRequest, OrderStatus } from '../../../shared/models/order.model';

// Load Orders
export const loadOrders = createAction('[Orders] Load Orders');
export const loadOrdersSuccess = createAction(
  '[Orders] Load Orders Success',
  props<{ orders: Order[] }>()
);
export const loadOrdersFailure = createAction(
  '[Orders] Load Orders Failure',
  props<{ error: string }>()
);

// Load Single Order (for tracking)
export const loadOrderById = createAction('[Orders] Load Order By ID', props<{ id: string }>());
export const loadOrderByIdSuccess = createAction(
  '[Orders] Load Order By ID Success',
  props<{ order: Order }>()
);
export const loadOrderByIdFailure = createAction(
  '[Orders] Load Order By ID Failure',
  props<{ error: string }>()
);

// Create Order
export const createOrder = createAction(
  '[Orders] Create Order',
  props<{ order: CreateOrderRequest }>()
);
export const createOrderSuccess = createAction(
  '[Orders] Create Order Success',
  props<{ order: Order }>()
);
export const createOrderFailure = createAction(
  '[Orders] Create Order Failure',
  props<{ error: string }>()
);

// Update Order Status
export const updateOrderStatus = createAction(
  '[Orders] Update Order Status',
  props<{ id: string; status: OrderStatus }>()
);
export const updateOrderStatusSuccess = createAction(
  '[Orders] Update Order Status Success',
  props<{ order: Order }>()
);
export const updateOrderStatusFailure = createAction(
  '[Orders] Update Order Status Failure',
  props<{ error: string }>()
);

// Update Order
export const updateOrder = createAction(
  '[Orders] Update Order',
  props<{ id: string; order: Partial<CreateOrderRequest> }>()
);
export const updateOrderSuccess = createAction(
  '[Orders] Update Order Success',
  props<{ order: Order }>()
);
export const updateOrderFailure = createAction(
  '[Orders] Update Order Failure',
  props<{ error: string }>()
);
