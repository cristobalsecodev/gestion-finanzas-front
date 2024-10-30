import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { actuallyLoggedGuard } from './actually-logged.guard';

describe('actuallyLoggedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => actuallyLoggedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
