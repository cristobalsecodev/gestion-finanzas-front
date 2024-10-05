import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisGastosComponent } from './mis-gastos.component';

describe('MisGastosComponent', () => {
  let component: MisGastosComponent;
  let fixture: ComponentFixture<MisGastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisGastosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisGastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
