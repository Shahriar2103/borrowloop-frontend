import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebService } from '../../web-services/web-service';

interface ItemCard {
  id: string;
  name: string;
  category: string;
  condition: string;
  deposit: number;
  available: boolean;
  icon: string;
}

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [],
  templateUrl: './items.html',
  styleUrl: './items.css'
})
export class Items implements OnInit {
  categories: string[] = ['All Items'];
  selectedCategory: string = 'All Items';
  searchTerm: string = '';

  page: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;

  isLoading: boolean = false;
  errorMessage: string = '';

  items: ItemCard[] = [];

  constructor(
    private router: Router,
    private webService: WebService
  ) {}

  ngOnInit(): void {
    this.loadItems(1);
  }

  loadItems(requestedPage: number): void {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.webService.getItems(requestedPage).subscribe({
      next: (response: any) => {
        console.log('BorrowLoop API response:', response);

        this.items = response.data.map((item: any): ItemCard => ({
          id: item.item_id,
          name: item.name,
          category: this.formatLabel(item.category),
          condition: this.formatLabel(item.condition),
          deposit: item.deposit,
          available: item.availability,
          icon: '📦'
        }));

        this.page = response.meta.page;
        this.totalPages = response.meta.pages;
        this.totalItems = response.meta.total;

        this.categories = [
          'All Items',
          ...new Set(this.items.map(item => item.category))
        ];

        this.selectedCategory = 'All Items';
        this.searchTerm = '';
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Failed to load BorrowLoop items:', error);

        this.errorMessage =
          'Unable to load items. Please try again.';

        this.isLoading = false;
      }
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages && !this.isLoading) {
      this.loadItems(this.page + 1);
    }
  }

  previousPage(): void {
    if (this.page > 1 && !this.isLoading) {
      this.loadItems(this.page - 1);
    }
  }

  get filteredItems(): ItemCard[] {
    const search = this.searchTerm.toLowerCase();

    return this.items.filter(item => {
      const matchesCategory =
        this.selectedCategory === 'All Items' ||
        item.category === this.selectedCategory;

      const matchesSearch =
        item.name.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  searchItems(value: string): void {
    this.searchTerm = value.trim();
  }

  viewItemDetails(id: string): void {
    this.router.navigate(['/items', id]);
  }

  private formatLabel(value: string): string {
    return value
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }
}