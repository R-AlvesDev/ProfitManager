import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from './transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/transactions'; // Adjust this URL as necessary

  constructor(private http: HttpClient) { }

  createTransaction(transactionData: any) {
    return this.http.post(this.apiUrl, transactionData);
  }

  getTotalIncome() {
    return this.http.get('/transactions/totalIncome');
  }
  
  getTotalExpenses() {
    return this.http.get('/transactions/totalExpenses');
  }

  getTransactions() {
    return this.http.get<Transaction[]>('/transactions');
  }
}