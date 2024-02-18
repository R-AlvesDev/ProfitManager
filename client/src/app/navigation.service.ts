import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) {}

  navigateToTransactions() {
    this.router.navigate(['/transactions/new']);
  }

  // Add other navigation methods as needed

}
