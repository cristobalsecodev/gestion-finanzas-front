import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActionType } from 'src/app/shared/enums/ActionType.enum';
import { capitalizeString, markForms } from 'src/app/shared/functions/Utils';
import { BaseCategory, Categories } from '../interfaces/IncomeOrExpense.interface';
import { filterAutocomplete } from 'src/app/shared/functions/AutocompleteFilter';
import { CategoriesAndSubCategoriesService } from '../services/Categories&SubCategories/categories-and-sub-categories.service';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-categories-subcategories-form',
  standalone: true,
  imports: [
    // Angular core
    ReactiveFormsModule,
    // Angular material
    MatInputModule,
    MatFormFieldModule,
    MatDialogTitle, 
    MatDialogContent, 
    MatDialogActions, 
    MatDialogClose, 
    MatTooltipModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatIconModule,
    MatTableModule,
    MatExpansionModule,
    MatButtonModule
  ],
  templateUrl: './categories-subcategories-form.component.html',
  styleUrl: './categories-subcategories-form.component.scss'
})
export class CategoriesSubcategoriesFormComponent {

  // Tipos de acción
  readonly actionTypes = ActionType

  // Máximo de longitud para las notas
  maxNotesLength: number = 30

  // Comprueba si el formulario de categoría está activo
  isFormCategory = signal<boolean>(false)

  // Comprueba si el formulario de subcategoría está activo
  isFormSubcategory = signal<boolean>(false)

  // Comprueba la acción el formulario
  actionType = signal<ActionType | null>(null)

  // Formularios de filtro
  searchName = new FormControl('');
  searchType = new FormControl('');

  // Formulario de categoría
  categoryForm!: FormGroup

  // Formulario de subcategoría
  subcategoryForm!: FormGroup

  // Categorías
  categories: Categories[] = []
  filteredCategories: Categories[] = []

  // Servicios
  categoriesService = inject(CategoriesAndSubCategoriesService)

  // Avisos formulario
  typeMessage: string = 'Type is required.'
  maxLengthMessage: string = 'Max length reached.'

  displayedColumns: string[] = ['name', 'type', 'actions']

  dataSourceCategories = new MatTableDataSource<Categories>([])
  dataSourceSubcategories = new MatTableDataSource<BaseCategory>([])

  readonly data: {
    categories: Categories[]
  } = inject(MAT_DIALOG_DATA)

  // Función para capitalizar strings
  capitalize = capitalizeString

  constructor() {

    this.categoryForm = new FormGroup({

      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      
      type: new FormControl('', [Validators.required]),

      color: new FormControl('', [Validators.required]),

    })

    this.subcategoryForm = new FormGroup({

      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),

    })

    effect(() => {

      this.categoryForm.reset()
      this.subcategoryForm.reset()

    })


  }

  ngOnInit(): void {

    this.categories = this.data.categories
    
    this.dataSourceCategories.data = this.data.categories

  }

  applyFilter(): void {

    let filterValue = this.searchName.value?.trim().toLowerCase() || ''
    let selectedType = this.searchType.value || ''
  
    this.dataSourceCategories.filterPredicate = (data: Categories) => {

      const matchesSearch = data.name.toLowerCase().includes(filterValue)
      const matchesType = selectedType ? data.type === selectedType : true
      
      return matchesSearch && matchesType

    }
  
    this.dataSourceCategories.filter = filterValue + selectedType
    
  }
  
  onCategorySearch(): void {

    const searchTerm = this.subcategoryForm.get('category')?.value

    this.filteredCategories = filterAutocomplete(this.categories.filter(category => category.type === this.subcategoryForm.get('type')?.value), searchTerm, ['name'])

  }

  filterCategories(): void {

    const categoriesFiltered = this.categories.filter(category => category.type === this.subcategoryForm.get('type')?.value)

    this.filteredCategories = categoriesFiltered ?? []

  }

  checkMandatoryFields(): void {

    // Marca el formulario de categoría
    markForms(this.categoryForm)

    // Marca el formulario de subcategoría
    markForms(this.subcategoryForm)

  }

  submitForm(): void {



  }


}
