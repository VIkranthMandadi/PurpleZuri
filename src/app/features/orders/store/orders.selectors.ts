import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrdersState } from './orders.state';

export const selectOrdersState = createFeatureSelector<OrdersState>('orders');

export const selectAllOrders = createSelector(
  selectOrdersState,
  (state: OrdersState) => state.orders
);

export const selectSelectedOrder = createSelector(
  selectOrdersState,
  (state: OrdersState) => state.selectedOrder
);

export const selectOrdersLoading = createSelector(
  selectOrdersState,
  (state: OrdersState) => state.loading
);

export const selectOrdersError = createSelector(
  selectOrdersState,
  (state: OrdersState) => state.error
);

// Select orders by status
export const selectOrdersByStatus = (status: string) =>
  createSelector(selectAllOrders, (orders) => orders.filter((order) => order.status === status));
