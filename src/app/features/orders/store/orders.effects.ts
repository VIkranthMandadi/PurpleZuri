import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SupabaseService } from '../../../core/services/supabase.service';
import * as OrdersActions from './orders.actions';

@Injectable()
export class OrdersEffects {
  constructor(private actions$: Actions, private supabaseService: SupabaseService) {}

  // Load all orders
  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadOrders),
      switchMap(() =>
        this.supabaseService
          .getOrders()
          .then((orders) => OrdersActions.loadOrdersSuccess({ orders }))
          .catch((error) => OrdersActions.loadOrdersFailure({ error: error.message }))
      ),
      catchError((error) => of(OrdersActions.loadOrdersFailure({ error: error.message })))
    )
  );

  // Load order by ID
  loadOrderById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadOrderById),
      switchMap(({ id }) =>
        this.supabaseService
          .getOrderById(id)
          .then((order) => {
            if (!order) {
              throw new Error('Order not found');
            }
            return OrdersActions.loadOrderByIdSuccess({ order });
          })
          .catch((error) => OrdersActions.loadOrderByIdFailure({ error: error.message }))
      ),
      catchError((error) => of(OrdersActions.loadOrderByIdFailure({ error: error.message })))
    )
  );

  // Create order
  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.createOrder),
      switchMap(({ order }) =>
        this.supabaseService
          .createOrder(order)
          .then((createdOrder) => OrdersActions.createOrderSuccess({ order: createdOrder }))
          .catch((error) => OrdersActions.createOrderFailure({ error: error.message }))
      ),
      catchError((error) => of(OrdersActions.createOrderFailure({ error: error.message })))
    )
  );

  // Update order status
  updateOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.updateOrderStatus),
      switchMap(({ id, status }) =>
        this.supabaseService
          .updateOrderStatus(id, status)
          .then((updatedOrder) => OrdersActions.updateOrderStatusSuccess({ order: updatedOrder }))
          .catch((error) => OrdersActions.updateOrderStatusFailure({ error: error.message }))
      ),
      catchError((error) => of(OrdersActions.updateOrderStatusFailure({ error: error.message })))
    )
  );
}