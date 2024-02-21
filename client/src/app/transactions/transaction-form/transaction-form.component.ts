import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TransactionService } from '../../transaction.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigationService } from '../../navigation.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent {
  transactionForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private transactionService: TransactionService, public navigationService: NavigationService) {
    this.transactionForm = this.formBuilder.group({
      amount: '',
      category: '',
      type: '',
      date: ''
    });
  }

  onSubmit(): void {
    console.log(this.transactionForm.value);
    
    if(!this.transactionForm.value.amount && !this.transactionForm.value.category && !this.transactionForm.value.type && !this.transactionForm.value.date){
      console.error('Error creating transaction: Missing data from transaction');
    }
    else{
      this.transactionService.createTransaction(this.transactionForm.value).subscribe({
        next: (res) => console.log('Transaction created', res),
        error: (err) => console.error('Error creating transaction:', err)
      });
    }
  }
}