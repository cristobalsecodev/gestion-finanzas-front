import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisIngresosGastosFormularioComponent } from './mis-ingresos-gastos-formulario.component';

describe('MisIngresosGastosFormularioComponent', () => {
  let component: MisIngresosGastosFormularioComponent;
  let fixture: ComponentFixture<MisIngresosGastosFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisIngresosGastosFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisIngresosGastosFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
