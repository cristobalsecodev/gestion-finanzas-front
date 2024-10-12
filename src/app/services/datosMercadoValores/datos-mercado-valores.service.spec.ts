import { TestBed } from '@angular/core/testing';

import { DatosMercadoValoresService } from './datos-mercado-valores.service';

describe('DatosMercadoValoresService', () => {
  let service: DatosMercadoValoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosMercadoValoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
