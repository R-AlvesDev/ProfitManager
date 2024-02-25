import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
    const currentUser = this.authService.currentUserValue;
    if (currentUser || this.authService.isGuestMode()) {
      return true;
    }
    // Redirect to welcome page and return a UrlTree
    return this.router.createUrlTree(['/welcome']);
  };
}