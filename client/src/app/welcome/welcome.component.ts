import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  constructor(private authService: AuthService, public navigationService: NavigationService) { }

  login() {
    this.navigationService.navigateToLogin();
  }

  register() {
    this.navigationService.navigateToRegistration();
  }

  proceedAsGuest() {
    this.authService.setGuestMode(true);
    this.navigationService.navigateToDashboard();
  }

}
