import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      this.currentUserSubject = new BehaviorSubject<any>(
        storedUser ? JSON.parse(storedUser) : null
      );
    } else {
      this.currentUserSubject = new BehaviorSubject<any>(null);
    }
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  register(username: string, email: string, password: string) {
    return this.http.post<any>(`/register`, { username, email, password }).pipe(
      tap((data) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.currentUserSubject.next(data);
        }
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`/login`, { email, password }).pipe(
      tap(data => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.currentUserSubject.next(data);
        }
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }
}