import { TestBed } from '@angular/core/testing';

import { NewPasswordResolverService } from './new-password-resolver.service';

describe('NewPasswordResolverService', () => {
  let service: NewPasswordResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewPasswordResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
