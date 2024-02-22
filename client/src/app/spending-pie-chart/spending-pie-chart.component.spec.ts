import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingPieChartComponent } from './spending-pie-chart.component';

describe('SpendingPieChartComponent', () => {
  let component: SpendingPieChartComponent;
  let fixture: ComponentFixture<SpendingPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingPieChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpendingPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
