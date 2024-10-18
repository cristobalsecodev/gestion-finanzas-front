import { TestBed } from '@angular/core/testing';

import { ConversionMonedaService } from './conversion-moneda.service';

describe('ConversionMonedaService', () => {
  let service: ConversionMonedaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversionMonedaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
