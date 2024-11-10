import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFlatButtonComponent } from './dynamic-button.component';

describe('DynamicFlatButtonComponent', () => {
  let component: DynamicFlatButtonComponent;
  let fixture: ComponentFixture<DynamicFlatButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFlatButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFlatButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
