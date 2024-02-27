import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularChartComponent } from './tabular-chart.component';

describe('TabularChartComponent', () => {
  let component: TabularChartComponent;
  let fixture: ComponentFixture<TabularChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabularChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabularChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
