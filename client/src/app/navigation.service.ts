import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) {}

  navigateToWelcome() {
    this.router.navigate(['/welcome']);
  }
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToLogin(){
    this.router.navigate(['/login']);
  }

  navigateToRegistration(){
    this.router.navigate(['/register']);
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

  navigateToStatistics() {
    this.router.navigate(['/statistics']);
  }

}
