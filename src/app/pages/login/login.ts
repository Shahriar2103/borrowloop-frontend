import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  email: string = '';
  password: string = '';

  showPassword: boolean = false;
  isLoading: boolean = false;

  errorMessage: string = '';
  successMessage: string = '';

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (this.isLoading) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const email = this.email.trim().toLowerCase();

    if (!email || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    if (!this.isValidEmail(email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.isLoading = true;

    this.authService.login({
      email,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (
          response.success &&
          response.data?.user &&
          this.authService.isLoggedIn()
        ) {
          this.password = '';
          this.router.navigate(['/items']);
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      },

      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage =
            'Incorrect email or password. Please try again.';
        } else if (error.status === 403) {
          this.errorMessage =
            'This account cannot sign in. Please contact support.';
        } else if (error.status === 0) {
          this.errorMessage =
            'Cannot connect to BorrowLoop. Check that the backend is running.';
        } else {
          this.errorMessage =
            'Unable to sign in right now. Please try again.';
        }
      }
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}