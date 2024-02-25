import { Component } from '@angular/core';
import { NavigationService } from '../navigation.service';
import { TransactionService } from '../transaction.service';
import { TotalResponse } from '../total-response';
import { CommonModule } from '@angular/common';
import { SpendingPieChartComponent } from "../spending-pie-chart/spending-pie-chart.component";
import { NgChartsModule } from 'ng2-charts';
import { LoginComponent } from "../login/login.component";
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    imports: [CommonModule, SpendingPieChartComponent, NgChartsModule, LoginComponent]
})
export class DashboardComponent {

  today: Date = new Date();
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  currentMonthName: string = this.months[this.today.getMonth()];

  totalIncome = 0;
  totalExpenses = 0;
  cashFlow = 0;

  constructor(
    public navigationService: NavigationService,
    private transactionService: TransactionService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.fetchDataForCurrentMonth();
  }

  fetchDataForCurrentMonth() {
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
      .getTotalIncome(startOfMonth, endOfMonth)
      .subscribe((response: TotalResponse) => {
        this.totalIncome = response.total;
        this.updateCashFlow();
      });

    this.transactionService
      .getTotalExpenses(startOfMonth, endOfMonth)
      .subscribe((response: TotalResponse) => {
        this.totalExpenses = response.total;
        this.updateCashFlow();
      });
  }

  updateCashFlow() {
    this.cashFlow = this.totalIncome - this.totalExpenses;
  }

  isLoggedIn(): boolean {
    return this.authService.currentUserValue !== null;
  }
}
