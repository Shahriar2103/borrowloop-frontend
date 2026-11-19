import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { WebService } from '../../web-services/web-service';
import { Auth } from '../../services/auth';

interface ItemDetailsData {
  id: string;
  name: string;
  description: string;
  category: string;
  condition: string;
  deposit: number;
  available: boolean;
  icon: string;
}

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './item-details.html',
  styleUrl: './item-details.css'
})
export class ItemDetails implements OnInit {
  item: ItemDetailsData | undefined;

  isLoading: boolean = true;
  errorMessage: string = '';

  startDate: string = '';
  returnDate: string = '';
  message: string = '';

  isSubmitting: boolean = false;
  requestSubmitted: boolean = false;
  requestError: string = '';
  requestSuccess: string = '';

  readonly today: string = this.getToday();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private webService: WebService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id');

    if (!itemId) {
      this.errorMessage = 'No item was selected.';
      this.isLoading = false;
      return;
    }

    this.webService.getItem(itemId).subscribe({
      next: (response: any) => {
        const data = response.data;

        this.item = {
          id: data.item_id,
          name: data.name,
          description: data.description,
          category: this.formatLabel(data.category),
          condition: this.formatLabel(data.condition),
          deposit: data.deposit,
          available: data.availability,
          icon: '📦'
        };

        this.isLoading = false;
      },

      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.status === 404
          ? 'This item could not be found.'
          : 'Unable to load this item. Please try again.';

        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/items']);
  }

  requestBorrow(): void {
    if (
      !this.item ||
      !this.item.available ||
      this.isSubmitting ||
      this.requestSubmitted
    ) {
      return;
    }

    this.requestError = '';
    this.requestSuccess = '';

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.startDate || !this.returnDate) {
      this.requestError = 'Please select both borrowing dates.';
      return;
    }

    if (this.startDate < this.getToday()) {
      this.requestError = 'The start date cannot be in the past.';
      return;
    }

    if (this.returnDate <= this.startDate) {
      this.requestError =
        'The return date must be after the start date.';
      return;
    }

    if (this.message.trim().length > 1000) {
      this.requestError =
        'Your message must be 1,000 characters or fewer.';
      return;
    }

    this.isSubmitting = true;

    this.webService.createBorrowRequest({
      item_id: this.item.id,
      start_date: this.startDate,
      return_date: this.returnDate,
      message: this.message.trim()
    }).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;

        if (!response.success || !response.data?.request_id) {
          this.requestError =
            'Unexpected response. Check your requests before retrying.';
          return;
        }

        this.requestSubmitted = true;

        const requestId = response.data.request_id;

        if (response.data.status === 'rejected') {
          this.requestError =
            `Request ${requestId} was automatically declined by the lender’s rules.`;
        } else {
          this.requestSuccess =
            `Request ${requestId} sent. Status: ${response.data.status}.`;
        }
      },

      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;

        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
          return;
        }

        this.requestError = error.status === 0
          ? 'The request could not be confirmed. Check your requests before retrying.'
          : error.error?.error?.message ||
            'Unable to send your borrowing request. Please try again.';
      }
    });
  }

  private getToday(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private formatLabel(value: string): string {
    return value
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }
}