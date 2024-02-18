import { Component } from '@angular/core';
import { NavigationService } from '../navigation.service';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  
  constructor(public navigationService: NavigationService, private transactionService: TransactionService) {}

  //TODO: create interface for the response so any is not needed
  ngOnInit() {
    this.transactionService.getTotalIncome().subscribe((response: any) => {
      this.totalIncome = response as number; // Assuming response itself is the total income value
      this.updateCashFlow();
    });
    this.transactionService.getTotalExpenses().subscribe((response: any) => {
      this.totalExpenses = response as number; // Assuming response itself is the total expenses value
      this.updateCashFlow();
    });
  }
  
  updateCashFlow() {
    this.cashFlow = this.totalIncome - this.totalExpenses;
  }

  totalIncome = 0;
  totalExpenses = 0;
  cashFlow = 0;

}
