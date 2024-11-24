import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeOrExpenseListComponent } from './income-or-expense-list.component';

describe('IncomeOrExpenseListComponent', () => {
  let component: IncomeOrExpenseListComponent;
  let fixture: ComponentFixture<IncomeOrExpenseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeOrExpenseListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeOrExpenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
