import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeOrExpenseFormComponent } from './income-or-expense-form.component';

describe('IncomeOrExpenseFormComponent', () => {
  let component: IncomeOrExpenseFormComponent;
  let fixture: ComponentFixture<IncomeOrExpenseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeOrExpenseFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeOrExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
