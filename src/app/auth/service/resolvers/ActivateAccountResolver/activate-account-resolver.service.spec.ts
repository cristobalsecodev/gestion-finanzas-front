import { TestBed } from '@angular/core/testing';

import { ActivateAccountResolverService } from './activate-account-resolver.service';

describe('ActivateAccountResolverService', () => {
  let service: ActivateAccountResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivateAccountResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
