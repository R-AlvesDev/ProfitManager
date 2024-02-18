import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/transactions'; // Adjust this URL as necessary

  constructor(private http: HttpClient) { }

  createTransaction(transactionData: any) {
    return this.http.post(this.apiUrl, transactionData);
  }
}