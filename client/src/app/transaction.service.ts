import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Transaction } from './transaction';
import { TotalResponse } from './total-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/transactions/';

  constructor(private http: HttpClient) { }

  createTransaction(transactionData: any) {
    return this.http.post(this.apiUrl, transactionData);
  }

  getTotalIncome(startDate: string, endDate: string): Observable<TotalResponse> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<TotalResponse>(this.apiUrl + 'totalIncome', { params });
  }
  
  getTotalExpenses(startDate: string, endDate: string): Observable<TotalResponse> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<TotalResponse>(this.apiUrl + 'totalExpenses', { params });
  }
  
  getTransactionsByMonth(startDate: string, endDate: string) {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<Transaction[]>(this.apiUrl + 'byMonth', { params });
  }

  getTransactions() {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  getTransactionsByMonthAndYear(month: number, year: number) {
    const params = new HttpParams().set('month', month).set('year', year);
    return this.http.get<Transaction[]>(this.apiUrl + 'byMonthYear', {params});
  }
}