import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SupabaseService } from '../../../core/services/supabase.service';
import * as OrdersActions from './orders.actions';

@Injectable()
export class OrdersEffects {
  // Inject dependencies directly into properties
  private actions$ = inject(Actions);
  private supabaseService = inject(SupabaseService);

  // Load all orders
  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadOrders),
      switchMap(() =>
        from(this.supabaseService.getOrders()).pipe(
          map((orders) => OrdersActions.loadOrdersSuccess({ orders })),
          catchError((error) => of(OrdersActions.loadOrdersFailure({ error: error.message })))
        )
      )
    )
  );

  // Load order by ID
  loadOrderById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadOrderById),
      switchMap(({ id }) =>
        from(this.supabaseService.getOrderById(id)).pipe(
          map((order) => {
            if (!order) {
              throw new Error('Order not found');
            }
            return OrdersActions.loadOrderByIdSuccess({ order });
          }),
          catchError((error) => of(OrdersActions.loadOrderByIdFailure({ error: error.message })))
        )
      )
    )
  );

  // Create order
  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.createOrder),
      switchMap(({ order }) =>
        from(this.supabaseService.createOrder(order)).pipe(
          map((createdOrder) => OrdersActions.createOrderSuccess({ order: createdOrder })),
          catchError((error) => of(OrdersActions.createOrderFailure({ error: error.message })))
        )
      )
    )
  );

  // Update order status
  updateOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.updateOrderStatus),
      switchMap(({ id, status }) =>
        from(this.supabaseService.updateOrderStatus(id, status)).pipe(
          map((updatedOrder) => OrdersActions.updateOrderStatusSuccess({ order: updatedOrder })),
          catchError((error) =>
            of(OrdersActions.updateOrderStatusFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Update order
  updateOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.updateOrder),
      switchMap(({ id, order }) =>
        from(this.supabaseService.updateOrder(id, order)).pipe(
          map((updatedOrder) => OrdersActions.updateOrderSuccess({ order: updatedOrder })),
          catchError((error) => of(OrdersActions.updateOrderFailure({ error: error.message })))
        )
      )
    )
  );
}
