import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaGeneralComponent } from './tabla-general.component';

describe('TablaGeneralComponent', () => {
  let component: TablaGeneralComponent;
  let fixture: ComponentFixture<TablaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
