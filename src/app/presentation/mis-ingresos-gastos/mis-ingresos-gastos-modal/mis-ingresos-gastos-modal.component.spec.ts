import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisIngresosGastosModalComponent } from './mis-ingresos-gastos-modal.component';

describe('MisIngresosGastosModalComponent', () => {
  let component: MisIngresosGastosModalComponent;
  let fixture: ComponentFixture<MisIngresosGastosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisIngresosGastosModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisIngresosGastosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
