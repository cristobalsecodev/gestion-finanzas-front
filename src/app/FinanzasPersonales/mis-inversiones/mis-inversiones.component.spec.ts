import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisInversionesComponent } from './mis-inversiones.component';

describe('MisInversionesComponent', () => {
  let component: MisInversionesComponent;
  let fixture: ComponentFixture<MisInversionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisInversionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisInversionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
