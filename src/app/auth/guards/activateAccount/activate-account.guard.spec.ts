import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { activateAccountGuard } from './activate-account.guard';


describe('activateAccountGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => activateAccountGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
