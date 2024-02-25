import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, public navigationService: NavigationService) {
    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return; // Optionally, handle form validation feedback
    }
  
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (data) => {
        // Handle successful login, e.g., navigate to the dashboard
        this.navigationService.navigateToDashboard();
      },
      error: (error) => {
        // Handle login error, e.g., show a user-friendly error message
        console.error('Login failed: ', error);
      }
    });
  }

}
