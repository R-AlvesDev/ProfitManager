import { Component } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { TransactionService } from '../transaction.service';
import { SpendingByCategory } from '../spending-by-category';

@Component({
  selector: 'app-spending-pie-chart',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './spending-pie-chart.component.html',
  styleUrl: './spending-pie-chart.component.css'
})
export class SpendingPieChartComponent {
  public pieChartOptions = {
    responsive: true,
  };
  public pieChartLabels: string[] = [];
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: this.pieChartLabels,
    datasets: [{ data: [] }]
  };
  public pieChartType: ChartType = 'pie';

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadSpendingData();
  }

  loadSpendingData() {
    this.transactionService.getSpendingByCategory().subscribe((data: SpendingByCategory[]) => {
      this.pieChartLabels = data.map((item) => item.category);
      
      // Recreate the pieChartData object
      this.pieChartData = {
        ...this.pieChartData, // Spread operator to copy existing properties
        labels: this.pieChartLabels,
        datasets: [{
          ...this.pieChartData.datasets[0],
          data: data.map((item) => item.total)
        }]
      };
    });
  }
}
