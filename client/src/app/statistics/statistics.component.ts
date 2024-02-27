import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SpendingPieChartComponent } from "../spending-pie-chart/spending-pie-chart.component";


@Component({
    selector: 'app-statistics',
    standalone: true,
    templateUrl: './statistics.component.html',
    styleUrl: './statistics.component.css',
    imports: [MatTabsModule, SpendingPieChartComponent]
})
export class StatisticsComponent {

}
