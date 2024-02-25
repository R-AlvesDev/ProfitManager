import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private isGuest = false;

  // Store the token in memory
  private _token: string | null = null;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.currentUserSubject = new BehaviorSubject<any>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  // Add this getter to retrieve the token
  public get token(): string | null {
    return this._token;
  }

  register(email: string, password: string) {
    return this.http.post<any>(`/register`, { email, password }).pipe(
      tap((data) => {
        this.currentUserSubject.next(data);
        // Store the token in memory
        this._token = data.token;
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`/login`, { email, password }).pipe(
      tap(data => {
        this.currentUserSubject.next(data);
        // Store the token in memory
        this._token = data.token;
      })
    );
  }

  logout() {
    this.currentUserSubject.next(null);
    // Clear the token
    this._token = null;
  }

  setGuestMode(isGuest: boolean) {
    this.isGuest = isGuest;
  }

  isGuestMode() {
    return this.isGuest;
  }
}