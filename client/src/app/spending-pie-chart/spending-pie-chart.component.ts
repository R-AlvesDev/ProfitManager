import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, ChartData, ChartOptions, ChartType } from 'chart.js';
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
export class SpendingPieChartComponent implements AfterViewInit{

  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef<HTMLCanvasElement>;

  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Control the display of the legend
        position: 'right', // Adjust legend position if necessary
        labels: {
          font: {
            size: 10, // Adjust font size as needed
          },
        },
      },
      tooltip: {
        bodyFont: {
          size: 10, // Adjust tooltip font size
        },
        callbacks: {
        }
      },
    },
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

  ngAfterViewInit() {
    this.scaleCanvasForHighDPI();
  }

  scaleCanvasForHighDPI() {
    const canvas: HTMLCanvasElement = this.pieChartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

        // Check if the context is null
    if (!ctx) {
      console.error('Failed to get 2D context');
      return; // Early return if ctx is null
    }

    // Assume the desired width and height are 300x300 (to match your div container)
    let desiredWidth = 300;
    let desiredHeight = 300;

    // Adjust for device pixel ratio
    let devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = desiredWidth * devicePixelRatio;
    canvas.height = desiredHeight * devicePixelRatio;
    canvas.style.width = `${desiredWidth}px`;
    canvas.style.height = `${desiredHeight}px`;

    // Scale the context to ensure correct drawing dimensions
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }
}
