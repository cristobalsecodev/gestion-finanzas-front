import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisIngresosGastosComponent } from './mis-ingresos-gastos.component';

describe('MisIngesosGastosComponent', () => {
  let component: MisIngresosGastosComponent;
  let fixture: ComponentFixture<MisIngresosGastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisIngresosGastosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisIngresosGastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
