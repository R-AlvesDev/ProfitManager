import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: string[] = [
    'Groceries',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Transport',
    'Rent/Mortgage',
    'Insurance',
    'Savings/Investments',
    'Debt Repayment',
    'Education',
    'Dining/Eating Out',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Clothing',
    'Healthcare/Medical',
    'Gifts/Donations',
    'Personal Care',
    'Pets',
    'Home Maintenance/Improvement',
    'Salary(Income Only)',
  ];

  getCategories(): string[] {
    return this.categories;
  }
}
