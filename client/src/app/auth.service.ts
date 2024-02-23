import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  register(username: string, email: string, password: string) {
    return this.http.post<any>(`/register`, { username, email, password }).pipe(
      tap((data) => {
        // Assuming the API returns data similar to what's expected for a login
        // You might want to automatically log the user in upon successful registration
        localStorage.setItem('currentUser', JSON.stringify(data));
        this.currentUserSubject.next(data);
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`/login`, { email, password }).pipe(
      tap(data => {
        localStorage.setItem('currentUser', JSON.stringify(data));
        this.currentUserSubject.next(data);
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
