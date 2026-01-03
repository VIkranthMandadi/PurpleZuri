import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { createOrder } from '../../../orders/store/orders.actions';
import { selectOrdersLoading, selectOrdersError } from '../../../orders/store/orders.selectors';
import { CreateOrderRequest } from '../../../../shared/models/order.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  // Form group for order creation
  orderForm: FormGroup;

  // Observable to track loading state from NgRx store
  loading$: Observable<boolean>;

  // Observable to track errors from NgRx store
  error$: Observable<string | null>;

  // Local state for showing success message
  showSuccess = false;

  constructor(private fb: FormBuilder, private store: Store) {
    // Initialize form with validators
    this.orderForm = this.fb.group({
      customer_name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[\d\s\-\+\(\)]+$/)]],
      fabric: ['', [Validators.required, Validators.minLength(2)]],
    });

    // Connect to NgRx store selectors
    this.loading$ = this.store.select(selectOrdersLoading);
    this.error$ = this.store.select(selectOrdersError);
  }

  ngOnInit(): void {
    // Watch for successful order creation
    this.loading$
      .pipe(
        filter((loading) => !loading), // Only proceed when loading is false
        take(1) // Take only the first emission after loading stops
      )
      .subscribe(() => {
        // Small delay to ensure state has updated
        setTimeout(() => {
          if (!this.orderForm.errors) {
            this.showSuccess = true;
            setTimeout(() => {
              this.showSuccess = false;
            }, 3000);
          }
        }, 100);
      });
  }

  onSubmit(): void {
    // Check if form is valid
    if (this.orderForm.valid) {
      // Create order request object (matching CreateOrderRequest interface)
      const orderData: CreateOrderRequest = {
        customer_name: this.orderForm.value.customer_name,
        phone: this.orderForm.value.phone,
        fabric: this.orderForm.value.fabric,
        status: 'shopping', // Default status for new orders
      };

      // Dispatch createOrder action to NgRx store
      // This triggers the OrdersEffects which calls Supabase service
      this.store.dispatch(createOrder({ order: orderData }));

      // Reset form immediately after dispatch
      this.orderForm.reset();
    } else {
      // Mark all fields as touched to show validation errors
      this.orderForm.markAllAsTouched();
    }
  }
}
