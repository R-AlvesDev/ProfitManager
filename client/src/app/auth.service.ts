import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private isGuest = false;

  // Store the tokens in memory
  private _accessToken: string | null = null;
  private _refreshToken: string | null = null;


  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.currentUserSubject = new BehaviorSubject<any>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  public get accessToken(): string | null {
    return this._accessToken;
  }

  public get refreshToken(): string | null {
    return this._refreshToken;
  }

  refreshAccessToken(): Observable<any> {
    // Use a full URL for the request
    const url = 'http://localhost:3000/refresh';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this._refreshToken);
    return this.http.post<any>(url, {}, { headers: headers }).pipe(
      tap(data => {
        // Store the new access token in memory
        this._accessToken = data.accessToken;
      })
    );
  }

  register(email: string, password: string) {
    return this.http.post<any>(`/register`, { email, password }).pipe(
      tap((data) => {
        this.currentUserSubject.next(data);
        // Store the tokens in memory
        this._accessToken = data.accessToken;
        this._refreshToken = data.refreshToken;
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`/login`, { email, password }).pipe(
      tap(data => {
        this.currentUserSubject.next(data);
        // Store the tokens in memory
        this._accessToken = data.accessToken;
        this._refreshToken = data.refreshToken;
      })
    );
  }

  logout() {
    this.currentUserSubject.next(null);
    // Clear the tokens
    this._accessToken = null;
    this._refreshToken = null;
  }

  setGuestMode(isGuest: boolean) {
    this.isGuest = isGuest;
  }

  isGuestMode() {
    return this.isGuest;
  }
}