import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;
  accountCreated: boolean = false;

  errorMessage: string = '';
  successMessage: string = '';

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register(): void {
    if (this.isLoading || this.accountCreated) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const name = this.fullName.trim();
    const email = this.email.trim().toLowerCase();

    if (!name || !email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please complete all fields.';
      return;
    }

    if (name.length < 2 || name.length > 80) {
      this.errorMessage = 'Your name must contain 2 to 80 characters.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (
      this.password.length < 8 ||
      !/[A-Za-z]/.test(this.password) ||
      !/\d/.test(this.password)
    ) {
      this.errorMessage =
        'Use at least 8 characters, including a letter and a number.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;

    this.authService.register({
      name,
      email,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (!response.success || !response.data?.user) {
          this.errorMessage =
            'Unexpected response. Try signing in before registering again.';
          return;
        }

        this.accountCreated = true;
        this.password = '';
        this.confirmPassword = '';

        if (this.authService.isLoggedIn()) {
          this.router.navigate(['/items']);
        } else {
          this.router.navigate(['/login']);
        }
      },

      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        if (error.status === 409) {
          this.errorMessage =
            'An account with this email already exists. Please sign in.';
        } else if (error.status === 0) {
          this.errorMessage =
            'Unable to confirm registration. Check your connection and try signing in before registering again.';
        } else {
          this.errorMessage =
            error.error?.error?.message ||
            'Unable to create your account. Please try again.';
        }
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}