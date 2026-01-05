import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { Order, OrderStatus } from '../../../../shared/models/order.model';

@Component({
  selector: 'app-customer-tracking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './customer-tracking.component.html',
  styleUrl: './customer-tracking.component.scss',
})
export class CustomerTrackingComponent {
  searchForm: FormGroup;
  order: Order | null = null;
  isLoading = false;
  error: string | null = null;
  searchType: 'orderNumber' | 'phone' = 'orderNumber';

  statusSteps: { status: OrderStatus; label: string; icon: string }[] = [
    { status: 'shopping', label: 'Shopping', icon: 'shopping_bag' },
    { status: 'stitching', label: 'Stitching', icon: 'content_cut' },
    { status: 'shipping', label: 'Shipping', icon: 'local_shipping' },
    { status: 'paid', label: 'Complete', icon: 'check_circle' },
  ];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.searchForm = this.fb.group({
      orderNumber: ['', [Validators.required, Validators.min(1)]],
      phone: ['', [Validators.pattern(/^[\d\s\-\+\(\)]+$/)]],
    });
  }

  setSearchType(type: 'orderNumber' | 'phone'): void {
    this.searchType = type;
    this.order = null;
    this.error = null;
    
    // Update validators based on search type
    const orderNumberControl = this.searchForm.get('orderNumber');
    const phoneControl = this.searchForm.get('phone');
    
    if (type === 'orderNumber') {
      orderNumberControl?.setValidators([Validators.required, Validators.min(1)]);
      phoneControl?.clearValidators();
    } else {
      orderNumberControl?.clearValidators();
      phoneControl?.setValidators([Validators.required, Validators.pattern(/^[\d\s\-\+\(\)]+$/)]);
    }
    
    orderNumberControl?.updateValueAndValidity({ emitEvent: false });
    phoneControl?.updateValueAndValidity({ emitEvent: false });
    this.searchForm.reset();
  }

  get isFormValid(): boolean {
    if (this.searchType === 'orderNumber') {
      return this.searchForm.get('orderNumber')?.valid ?? false;
    } else {
      return this.searchForm.get('phone')?.valid ?? false;
    }
  }

  async onSubmit(): Promise<void> {
    this.error = null;
    this.order = null;

    if (this.searchType === 'orderNumber') {
      const rawValue = this.searchForm.value.orderNumber;
      
      const orderNumber = typeof rawValue === 'string' ? parseInt(rawValue, 10) : Number(rawValue);
      
      if (!orderNumber || orderNumber <= 0 || isNaN(orderNumber)) {
        this.error = 'Please enter a valid order number';
        return;
      }
      await this.searchByOrderNumber(orderNumber);
    } else {
      const phone = this.searchForm.value.phone;
      if (!phone || !this.searchForm.get('phone')?.valid) {
        this.error = 'Please enter a valid phone number';
        return;
      }
      await this.searchByPhone(phone);
    }
  }

  private async searchByOrderNumber(orderNumber: number): Promise<void> {
    console.log('Starting search for order number:', orderNumber);
    this.isLoading = true;
    this.changeDetectorRef.detectChanges();
    this.error = null;
    
    try {
      const order = await this.supabaseService.getOrderByOrderNumber(orderNumber);
      
      if (order) {
        this.order = order;
        this.error = null;
      } else {
        this.error = 'Order not found. Please check your order number.';
        this.order = null;
      }
    } catch (error: any) {
      this.error = error?.message || error?.toString() || 'Error searching for order. Please try again.';
      this.order = null;
    } finally {
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  private async searchByPhone(phone: string): Promise<void> {
    this.isLoading = true;
    this.changeDetectorRef.detectChanges();
    try {
      const order = await this.supabaseService.getOrderByPhone(phone);
      if (order) {
        this.order = order;
      } else {
        this.error = 'No order found with this phone number.';
      }
    } catch (error: any) {
      this.error = error.message || 'Error searching for order. Please try again.';
    } finally {
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  getStatusIndex(status: OrderStatus): number {
    return this.statusSteps.findIndex((step) => step.status === status);
  }

  isStepCompleted(stepIndex: number): boolean {
    if (!this.order) return false;
    const currentIndex = this.getStatusIndex(this.order.status);
    return stepIndex <= currentIndex;
  }

  isStepActive(stepIndex: number): boolean {
    if (!this.order) return false;
    const currentIndex = this.getStatusIndex(this.order.status);
    return stepIndex === currentIndex;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
