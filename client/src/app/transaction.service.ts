import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Transaction } from './transaction';
import { TotalResponse } from './total-response';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/transactions/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getHttpOptions() {
    const token = this.authService.token; // replace with where you store your token
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return { headers };
  }

  createTransaction(transactionData: any) {
    return this.http.post(this.apiUrl, transactionData, this.getHttpOptions());
  }

  getTotalIncome(startDate: string, endDate: string): Observable<TotalResponse> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    const options = { ...this.getHttpOptions(), params };
    return this.http.get<TotalResponse>(this.apiUrl + 'totalIncome', options);
  }
  
  getTotalExpenses(startDate: string, endDate: string): Observable<TotalResponse> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    const options = { ...this.getHttpOptions(), params };
    return this.http.get<TotalResponse>(this.apiUrl + 'totalExpenses', options);
  }
  
  getTransactionsByMonth(startDate: string, endDate: string) {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    const options = { ...this.getHttpOptions(), params };
    return this.http.get<Transaction[]>(this.apiUrl + 'byMonth', options);
  }

  getTransactions() {
    return this.http.get<Transaction[]>(this.apiUrl, this.getHttpOptions());
  }

  getTransactionsByMonthAndYear(month: number, year: number) {
    const params = new HttpParams().set('month', month).set('year', year);
    const options = { ...this.getHttpOptions(), params };
    return this.http.get<Transaction[]>(this.apiUrl + 'byMonthYear', options);
  }

  getTransactionById(transactionId: string) {
    return this.http.get<Transaction>(this.apiUrl + transactionId, this.getHttpOptions());
  }

  getSpendingByCategory(): Observable<any> {
    return this.http.get(this.apiUrl + 'spendingByCategory', this.getHttpOptions());
  }

  updateTransaction(transactionId: string, transactionData: any): Observable<any> {
    return this.http.put(this.apiUrl + transactionId, transactionData, this.getHttpOptions());
  }

  deleteTransaction(transactionId: string): Observable<any> {
    return this.http.delete(this.apiUrl + transactionId, this.getHttpOptions());
  }
}