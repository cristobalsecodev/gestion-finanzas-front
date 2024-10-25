import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiResumenComponent } from './mi-resumen.component';

describe('MiResumenComponent', () => {
  let component: MiResumenComponent;
  let fixture: ComponentFixture<MiResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiResumenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
