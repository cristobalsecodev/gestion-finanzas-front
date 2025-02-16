import { TestBed } from '@angular/core/testing';

import { LoggedResolverService } from './logged-resolver.service';

describe('LoggedResolverService', () => {
  let service: LoggedResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggedResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
