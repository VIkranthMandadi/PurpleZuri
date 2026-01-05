import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { loadOrders, updateOrderStatus } from '../../../orders/store/orders.actions';
import {
  selectAllOrders,
  selectOrdersLoading,
  selectOrdersError,
} from '../../../orders/store/orders.selectors';
import { Order, OrderStatus } from '../../../../shared/models/order.model';
import { OrderDialogComponent } from '../order-dialog/order-dialog.component';
import { OrderInfoModalComponent } from '../order-info-modal/order-info-modal.component';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  orders$: Observable<Order[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  searchTerm = '';
  selectedStatus: OrderStatus | null = null;

  displayedColumns: string[] = [
    'order_number',
    'customer_name',
    'phone',
    'fabric',
    'status',
    'created_at',
  ];
  statusOptions: OrderStatus[] = ['shopping', 'stitching', 'shipping', 'paid'];

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {
    this.orders$ = this.store.select(selectAllOrders);
    this.loading$ = this.store.select(selectOrdersLoading);
    this.error$ = this.store.select(selectOrdersError);
  }

  ngOnInit(): void {
    // Load orders when component initializes
    this.store.dispatch(loadOrders());

    // Subscribe to error stream to show snackbar on errors
    this.error$.subscribe((error) => {
      if (error) {
        this.snackBar.open(`Error: ${error}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      }
    });
  }

  openAddOrderDialog(): void {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      width: '500px',
      data: null, // Pass null for new order
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Reload orders after successful creation
        this.store.dispatch(loadOrders());
      }
    });
  }

  getStatusColor(status: OrderStatus): 'primary' | 'accent' | 'warn' | undefined {
    switch (status) {
      case 'shopping':
        return 'primary';
      case 'stitching':
        return 'accent';
      case 'shipping':
        return 'warn';
      case 'paid':
        return undefined; // Default color
      default:
        return undefined;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  onStatusChange(orderId: string, newStatus: OrderStatus): void {
    this.store.dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  }

  openOrderInfo(order: Order, event: Event): void {
    // Prevent opening modal when clicking on the status select
    if ((event.target as HTMLElement).closest('.status-select')) {
      return;
    }

    this.dialog.open(OrderInfoModalComponent, {
      width: '500px',
      data: order,
    });
  }

  async logout(): Promise<void> {
    const { error } = await this.authService.logout();
    if (error) {
      this.snackBar.open('Error logging out', 'Close', {
        duration: 3000,
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  filterOrders(orders: Order[]): Order[] {
    let filtered = orders;

    // Filter by status
    if (this.selectedStatus) {
      filtered = filtered.filter((order) => order.status === this.selectedStatus);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.trim();
      const isNumberOnly = /^\d+$/.test(term);

      filtered = filtered.filter((order) => {
        if (isNumberOnly) {
          return order.order_number?.toString() === term;
        } else {
          return order.customer_name.toLowerCase().includes(term.toLowerCase());
        }
      });
    }

    return filtered;
  }

  setStatusFilter(status: OrderStatus | null): void {
    this.selectedStatus = status;
  }
}
