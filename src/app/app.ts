import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { Auth, AuthUser } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('borrowloop-frontend');

  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  get currentUser(): AuthUser | null {
    return this.authService.getUser();
  }

  get showNavigation(): boolean {
    const path = this.router.url.split('?')[0].split('#')[0];

    return path !== '/login' && path !== '/register';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}