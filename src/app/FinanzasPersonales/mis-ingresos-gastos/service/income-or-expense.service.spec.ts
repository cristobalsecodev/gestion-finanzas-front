import { TestBed } from '@angular/core/testing';

import { IncomeOrExpenseService } from './income-or-expense.service';

describe('IncomeOrExpenseService', () => {
  let service: IncomeOrExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncomeOrExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
