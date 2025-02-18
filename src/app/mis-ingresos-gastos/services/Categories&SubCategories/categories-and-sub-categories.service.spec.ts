import { TestBed } from '@angular/core/testing';

import { CategoriesAndSubCategoriesService } from './categories-and-sub-categories.service';

describe('CategoriesAndSubCategoriesService', () => {
  let service: CategoriesAndSubCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesAndSubCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
