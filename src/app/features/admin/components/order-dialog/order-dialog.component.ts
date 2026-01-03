import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { createOrder } from '../../../orders/store/orders.actions';
import { selectOrdersLoading } from '../../../orders/store/orders.selectors';
import { CreateOrderRequest } from '../../../../shared/models/order.model';

@Component({
  selector: 'app-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './order-dialog.component.html',
  styleUrl: './order-dialog.component.scss',
})
export class OrderDialogComponent implements OnInit {
  orderForm: FormGroup;
  loading$: Observable<boolean>;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.orderForm = this.fb.group({
      customer_name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[\d\s\-\+\(\)]+$/)]],
      fabric: ['', [Validators.required, Validators.minLength(2)]],
    });

    this.loading$ = this.store.select(selectOrdersLoading);
  }

  ngOnInit(): void {
    // Watch for successful order creation
    this.loading$
      .pipe(
        filter((loading) => !loading && this.isSubmitting),
        take(1)
      )
      .subscribe(() => {
        this.isSubmitting = false;
        this.dialogRef.close(true); // Return true to indicate success
      });
  }

  onSave(): void {
    if (this.orderForm.valid) {
      this.isSubmitting = true;
      const orderData: CreateOrderRequest = {
        customer_name: this.orderForm.value.customer_name,
        phone: this.orderForm.value.phone,
        fabric: this.orderForm.value.fabric,
        status: 'shopping',
      };

      this.store.dispatch(createOrder({ order: orderData }));
    } else {
      this.orderForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

