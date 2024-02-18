import { Component } from '@angular/core';
import { NavigationService } from '../../navigation.service';
import { TransactionService } from '../../transaction.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent {

  constructor(public navigationService: NavigationService, private transactionService: TransactionService) { }

  transactions: any[] = []; // Assuming you define an interface for transactions, use it instead of any

  ngOnInit() {
    this.transactionService.getTransactions().subscribe((data: any[]) => {
      this.transactions = data;
    });
  }
  cancel(): void {
    this.navigationService.navigateToDashboard();
  }

}
