import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  goToAdmin(): void {
    // If not authenticated, redirect to login
    // If authenticated but not admin, the guard will redirect back to home
    // If authenticated and admin, proceed to admin dashboard
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/admin']);
    }
  }

  goToCustomer(): void {
    // Future: Navigate to customer tracking page
    this.router.navigate(['/tracking']);
  }
}

