import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeOrExpenseComponent } from './income-or-expense.component';

describe('IncomeOrExpenseComponent', () => {
  let component: IncomeOrExpenseComponent;
  let fixture: ComponentFixture<IncomeOrExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeOrExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeOrExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
