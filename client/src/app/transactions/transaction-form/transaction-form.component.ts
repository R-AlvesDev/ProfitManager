import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TransactionService } from '../../transaction.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent {
  transactionForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private transactionService: TransactionService) {
    this.transactionForm = this.formBuilder.group({
      amount: '',
      category: '',
      type: '',
      date: ''
    });
  }

  onSubmit(): void {
    console.log(this.transactionForm.value);
    this.transactionService.createTransaction(this.transactionForm.value)
    .subscribe({
      next: (response) => console.log('Transaction created', response),
      error: (error) => console.error('Error creating transaction', error)
    });
  }
}