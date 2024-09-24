import { TestBed } from '@angular/core/testing';

import { SecurizeSVGsService } from './securize-svgs.service';

describe('SecurizeSVGsService', () => {
  let service: SecurizeSVGsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurizeSVGsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
