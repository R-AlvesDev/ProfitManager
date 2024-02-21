import { Component } from '@angular/core';
import { NavigationService } from '../../navigation.service';
import { TransactionService } from '../../transaction.service';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../transaction';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
})
export class TransactionListComponent {
  form: FormGroup;
  transactions: any[] = [];
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  months = [
    { value: 0, name: 'January' },
    { value: 1, name: 'February' },
    { value: 2, name: 'March' },
    { value: 3, name: 'April' },
    { value: 4, name: 'May' },
    { value: 5, name: 'June' },
    { value: 6, name: 'July' },
    { value: 7, name: 'August' },
    { value: 8, name: 'September' },
    { value: 9, name: 'October' },
    { value: 10, name: 'November' },
    { value: 11, name: 'December' },
  ];
  years: number[] = []; // Populate this array based on your requirements

  constructor(
    public navigationService: NavigationService,
    private transactionService: TransactionService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      selectedMonth: [new Date().getMonth()],
      selectedYear: [new Date().getFullYear()]
    });
  }

  ngOnInit() {
    this.populateYears();
    this.form.valueChanges.subscribe(() => {
      this.fetchTransactionsForMonth();
    });
    this.fetchTransactionsForMonth();
    console.log("Log 1" + this.fetchTransactionsForMonth());
  }

  populateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear; i++) {
      // Example: Load last 10 years to current year
      this.years.push(i);
    }
  }

  fetchTransactionsForMonth() {
    const month = this.form.get('selectedMonth')?.value;
    const year = this.form.get('selectedYear')?.value;
    this.transactionService.getTransactionsByMonthAndYear(+month + 1, year)
      .subscribe((transactions) => {
        this.transactions = transactions;
      });
  }

  fetchTransactionsForCurrentMonth() {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).toISOString();
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).toISOString();

    this.transactionService
      .getTransactionsByMonth(startOfMonth, endOfMonth)
      .subscribe((transactions: Transaction[]) => {
        this.transactions = transactions;
      });
  }
}
