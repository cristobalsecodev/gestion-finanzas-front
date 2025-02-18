import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesSubcategoriesFormComponent } from './categories-subcategories-form.component';

describe('CategoriesSubcategoriesFormComponent', () => {
  let component: CategoriesSubcategoriesFormComponent;
  let fixture: ComponentFixture<CategoriesSubcategoriesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesSubcategoriesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesSubcategoriesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
