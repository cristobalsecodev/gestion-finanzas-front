import { TestBed } from '@angular/core/testing';

import { SecurizarSVGsService } from './securizar-svgs.service';

describe('SecurizeSVGsService', () => {
  let service: SecurizarSVGsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurizarSVGsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
