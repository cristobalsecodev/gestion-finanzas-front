import { TestBed } from '@angular/core/testing';

import { ConversionDivisaService } from './conversion-divisa.service';

describe('ConversionDivisaService', () => {
  let service: ConversionDivisaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversionDivisaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
