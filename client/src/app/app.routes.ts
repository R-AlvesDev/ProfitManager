import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionFormComponent } from './transactions/transaction-form/transaction-form.component';
import { NgModule } from '@angular/core';
import { TransactionListComponent } from './transactions/transaction-list/transaction-list.component';
import { TransactionEditComponent } from './transactions/transaction-edit/transaction-edit.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AuthGuardService } from './auth-guard.service';
import { WelcomeComponent } from './welcome/welcome.component';

export const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent }, // Route for welcome page
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'transactions/new', component: TransactionFormComponent }, // Route for transaction form
  { path: 'transaction-list', component: TransactionListComponent}, // Route for transaction list
  { path: 'transactions/edit/:id', component: TransactionEditComponent }, // Route for transaction edit form
  { path: 'login', component: LoginComponent }, // Route for login form
  { path: 'register', component: RegistrationComponent }, // Route for registration form
  { path: '', redirectTo: '/welcome', pathMatch: 'full' } // Redirect to welcome page by default
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
