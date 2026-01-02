import { createReducer, on } from '@ngrx/store';
import * as OrdersActions from './orders.actions';
import { initialState, OrdersState } from './orders.state';

export const ordersReducer = createReducer(
  initialState,

  // Load Orders
  on(
    OrdersActions.loadOrders,
    (state): OrdersState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),
  on(
    OrdersActions.loadOrdersSuccess,
    (state, { orders }): OrdersState => ({
      ...state,
      orders,
      loading: false,
      error: null,
    })
  ),
  on(
    OrdersActions.loadOrdersFailure,
    (state, { error }): OrdersState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Load Order By ID
  on(
    OrdersActions.loadOrderById,
    (state): OrdersState => ({
      ...state,
      loading: true,
      error: null,
      selectedOrder: null,
    })
  ),
  on(
    OrdersActions.loadOrderByIdSuccess,
    (state, { order }): OrdersState => ({
      ...state,
      selectedOrder: order,
      loading: false,
      error: null,
    })
  ),
  on(
    OrdersActions.loadOrderByIdFailure,
    (state, { error }): OrdersState => ({
      ...state,
      loading: false,
      error,
      selectedOrder: null,
    })
  ),

  // Create Order
  on(
    OrdersActions.createOrder,
    (state): OrdersState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),
  on(
    OrdersActions.createOrderSuccess,
    (state, { order }): OrdersState => ({
      ...state,
      orders: [order, ...state.orders],
      loading: false,
      error: null,
    })
  ),
  on(
    OrdersActions.createOrderFailure,
    (state, { error }): OrdersState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Update Order Status
  on(
    OrdersActions.updateOrderStatus,
    (state): OrdersState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),
  on(
    OrdersActions.updateOrderStatusSuccess,
    (state, { order }): OrdersState => ({
      ...state,
      orders: state.orders.map((o) => (o.id === order.id ? order : o)),
      selectedOrder: state.selectedOrder?.id === order.id ? order : state.selectedOrder,
      loading: false,
      error: null,
    })
  ),
  on(
    OrdersActions.updateOrderStatusFailure,
    (state, { error }): OrdersState => ({
      ...state,
      loading: false,
      error,
    })
  )
);
