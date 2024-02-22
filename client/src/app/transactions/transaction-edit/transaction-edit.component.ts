import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../transaction.service';
import { NavigationService } from '../../navigation.service';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './transaction-edit.component.html',
  styleUrl: './transaction-edit.component.css'
})
export class TransactionEditComponent {
  transactionForm: FormGroup;
  categories: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    public navigationService: NavigationService,
    private categoryService: CategoryService
  ) {
    this.transactionForm = this.formBuilder.group({
      amount: '',
      category: '',
      type: '',
      date: '',
    });
    this.categories = this.categoryService.getCategories();
  }

  ngOnInit(): void {
    this.fetchTransactionToEdit();
    console.log(this.fetchTransactionToEdit());
  }

  fetchTransactionToEdit(): void {
    const transactionId = this.route.snapshot.paramMap.get('id');
    if (transactionId) {
      this.transactionService.getTransactionById(transactionId).subscribe(
        (transaction) => {
          this.transactionForm.setValue({
            amount: transaction.amount,
            category: transaction.category,
            type: transaction.type,
            date: transaction.date 
          });
        }
      );
      console.log(this.transactionService.getTransactionById(transactionId));
    }
  }
  onSubmit(): void {
    if (this.transactionForm.valid) {
      const transactionId = this.route.snapshot.paramMap.get('id');
      if (transactionId) {
        this.transactionService.updateTransaction(transactionId, this.transactionForm.value).subscribe({
          next: (response) => {
            console.log('Transaction updated successfully', response);
            // Navigate to the dashboard or another page
            this.navigationService.navigateToDashboard();
          },
          error: (error) => {
            console.error('There was an error updating the transaction', error);
            // Handle error, maybe show a user-friendly message
          }
        });
      }
    } else {
      console.error('Form is not valid');
      // Optionally, show an error message or highlight the form errors
    }
  }

}
