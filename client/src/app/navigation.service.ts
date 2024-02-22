import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToTransactions() {
    this.router.navigate(['/transactions/new']);
  }

  navigateToTransactionList() {
    this.router.navigate(['/transaction-list']);
  }

  navigateToTransactionEdit(transactionId: string) {
    this.router.navigate(['/transactions/edit', transactionId]);
  }

}
