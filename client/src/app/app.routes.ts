import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionFormComponent } from './transactions/transaction-form/transaction-form.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }, // Dashboard as default route
  { path: 'transactions/new', component: TransactionFormComponent } // Route for transaction form
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
