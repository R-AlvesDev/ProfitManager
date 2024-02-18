import { Component } from '@angular/core';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  
  constructor(public navigationService: NavigationService) {}

  ngOnInit() {

  }

  totalIncome = 0;
  totalExpenses = 0;
  cashFlow = 0;

}
