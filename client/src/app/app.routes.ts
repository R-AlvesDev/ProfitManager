import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionFormComponent } from './transactions/transaction-form/transaction-form.component';
import { NgModule } from '@angular/core';
import { TransactionListComponent } from './transactions/transaction-list/transaction-list.component';
import { TransactionEditComponent } from './transactions/transaction-edit/transaction-edit.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }, // Dashboard as default route
  { path: 'transactions/new', component: TransactionFormComponent }, // Route for transaction form
  { path: 'transaction-list', component: TransactionListComponent}, // Route for transaction list
  { path: 'transactions/edit/:id', component: TransactionEditComponent } // Route for transaction edit form
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
