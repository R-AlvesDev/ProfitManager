import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public navigationService: NavigationService
  ) {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(this.registrationForm.value.username, this.registrationForm.value.email, this.registrationForm.value.password).subscribe({
      next: () => {
        this.loading = false;
        // Navigate to login or dashboard as appropriate
        this.navigationService.navigateToLogin();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Registration failed. Please try again.';
        // Handle specific errors based on the API response if needed
      },
    });
  }
}
