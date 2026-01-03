import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Order, OrderStatus } from '../../../../shared/models/order.model';

@Component({
  selector: 'app-order-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
  ],
  templateUrl: './order-info-modal.component.html',
  styleUrl: './order-info-modal.component.scss',
})
export class OrderInfoModalComponent {
  constructor(
    private dialogRef: MatDialogRef<OrderInfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public order: Order
  ) {}

  getStatusColor(status: OrderStatus): 'primary' | 'accent' | 'warn' | undefined {
    switch (status) {
      case 'shopping':
        return 'primary';
      case 'stitching':
        return 'accent';
      case 'shipping':
        return 'warn';
      case 'paid':
        return undefined;
      default:
        return undefined;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

