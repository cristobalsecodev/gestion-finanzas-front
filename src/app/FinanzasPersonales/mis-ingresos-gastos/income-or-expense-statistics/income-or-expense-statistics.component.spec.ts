import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeOrExpenseStatisticsComponent } from './income-or-expense-statistics.component';

describe('IncomeOrExpenseStatisticsComponent', () => {
  let component: IncomeOrExpenseStatisticsComponent;
  let fixture: ComponentFixture<IncomeOrExpenseStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeOrExpenseStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeOrExpenseStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
