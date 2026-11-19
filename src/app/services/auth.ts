import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  user_id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: AuthUser;
    access_token: string;
    token_type: string;
    expires_in: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://127.0.0.1:5000/api/auth';

  private readonly tokenKey = 'borrowloop_token';
  private readonly userKey = 'borrowloop_user';
  private readonly expiryKey = 'borrowloop_token_expiry';

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      credentials
    ).pipe(
      tap(response => {
        if (response.success && response.data?.access_token) {
          this.saveSession(response.data);
        }
      })
    );
  }

  register(details: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      details
    ).pipe(
      tap(response => {
        if (response.success && response.data?.access_token) {
          this.saveSession(response.data);
        }
      })
    );
  }

  private saveSession(
    data: NonNullable<AuthResponse['data']>
  ): void {
    if (typeof window === 'undefined') {
      return;
    }

    const expiresAt = Date.now() + data.expires_in * 1000;

    sessionStorage.setItem(this.tokenKey, data.access_token);
    sessionStorage.setItem(this.userKey, JSON.stringify(data.user));
    sessionStorage.setItem(this.expiryKey, expiresAt.toString());
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const token = sessionStorage.getItem(this.tokenKey);
    const expiresAt = Number(
      sessionStorage.getItem(this.expiryKey)
    );

    if (
      !token ||
      !Number.isFinite(expiresAt) ||
      Date.now() >= expiresAt
    ) {
      this.logout();
      return null;
    }

    return token;
  }

  getUser(): AuthUser | null {
    if (!this.getToken()) {
      return null;
    }

    const storedUser = sessionStorage.getItem(this.userKey);

    if (!storedUser) {
      this.logout();
      return null;
    }

    try {
      const user = JSON.parse(storedUser);

      if (
        !user ||
        typeof user.user_id !== 'string' ||
        typeof user.name !== 'string' ||
        typeof user.email !== 'string' ||
        typeof user.role !== 'string'
      ) {
        this.logout();
        return null;
      }

      return user;
    } catch {
      this.logout();
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    if (typeof window === 'undefined') {
      return;
    }

    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.expiryKey);
  }
}