import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

import { Auth } from '../services/auth';

export interface BorrowRequestData {
  item_id: string;
  start_date: string;
  return_date: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebService {
  pageSize: number = 12;

  private readonly apiUrl = 'http://127.0.0.1:5000/api';

  constructor(
    private http: HttpClient,
    private authService: Auth
  ) {}

  getItems(page: number) {
    return this.http.get<any>(
      `${this.apiUrl}/items`,
      {
        params: {
          page: page.toString(),
          per_page: this.pageSize.toString()
        }
      }
    );
  }

  getItem(itemId: string) {
    return this.http.get<any>(
      `${this.apiUrl}/items/${encodeURIComponent(itemId)}`
    );
  }

  createBorrowRequest(data: BorrowRequestData) {
    const token = this.authService.getToken();

    if (!token) {
      return throwError(
        () => new Error('Please log in before requesting an item.')
      );
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(
      `${this.apiUrl}/borrow-requests`,
      data,
      { headers }
    );
  }
}