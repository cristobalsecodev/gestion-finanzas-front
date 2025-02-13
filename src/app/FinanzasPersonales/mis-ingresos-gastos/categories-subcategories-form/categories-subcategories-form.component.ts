import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActionType } from 'src/app/shared/enums/ActionType.enum';
import { capitalizeString, markForms } from 'src/app/shared/functions/Utils';
import { objectSelectedValidator } from 'src/app/shared/functions/Validators';
import { Categories } from '../interfaces/IncomeOrExpense.interface';
import { filterAutocomplete } from 'src/app/shared/functions/AutocompleteFilter';
import { CategoriesAndSubCategoriesService } from '../services/Categories&SubCategories/categories-and-sub-categories.service';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

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
    MatChipsModule,
    MatTooltipModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatIconModule
  ],
  templateUrl: './categories-subcategories-form.component.html',
  styleUrl: './categories-subcategories-form.component.scss'
})
export class CategoriesSubcategoriesFormComponent {

  // Tipos de acción
  readonly actionTypes = ActionType

  // Máximo de longitud para las notas
  maxNotesLength: number = 30

  // Comprueba si el formulario está activo
  isForm = signal<boolean>(false)

  // Comprueba la acción el formulario
  actionType = signal<ActionType | null>(null)

  // Selección del tipo de registro
  selectedType = signal<'category' | 'subcategory' | null>(null)

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
      
      type: new FormControl('', [Validators.required]),

      category: new FormControl('', [Validators.required, Validators.maxLength(50), objectSelectedValidator]),

    })

    effect(() => {

      this.categoryForm.reset()
      this.subcategoryForm.reset()

    })


  }

  ngOnInit(): void {

    this.categories = this.data.categories

  }

  onChangeChip(matChipChange: MatChipListboxChange): void {

    // Setea el signal con la selección o deselección
    this.selectedType.set(matChipChange.value)

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

    if(this.selectedType() === 'category') {

      // Marca el formulario de categoría
      markForms(this.categoryForm)

    } else {

      // Marca el formulario de subcategoría
      markForms(this.subcategoryForm)

    }


  }

  submitForm(): void {

  }


}
