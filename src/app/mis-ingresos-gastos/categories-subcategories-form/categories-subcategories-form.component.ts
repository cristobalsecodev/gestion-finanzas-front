import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { capitalizeString } from 'src/app/shared/functions/Utils';
import { BaseCategory, Categories } from '../interfaces/IncomeOrExpense.interface';
import { filterAutocomplete } from 'src/app/shared/functions/AutocompleteFilter';
import { CategoriesAndSubCategoriesService } from '../services/Categories&SubCategories/categories-and-sub-categories.service';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { ActionDialogComponent } from 'src/app/shared/components/dialogs/action-dialog/action-dialog.component';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { CommonModule } from '@angular/common';
import { whiteSpaceValidator } from 'src/app/shared/functions/Validators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { incomeExpensesRoute } from 'src/app/shared/constants/variables.constants';

@Component({
  selector: 'app-categories-subcategories-form',
  standalone: true,
  imports: [
    // Angular core
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    // Angular material
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './categories-subcategories-form.component.html',
  styleUrl: './categories-subcategories-form.component.scss'
})
export class CategoriesSubcategoriesFormComponent {

  // Ruta a ingresos y gastos
  incomeExpensesRoute = incomeExpensesRoute

  // Comprueba si el formulario de edición ed categoría está activo
  isEditCategory = signal<boolean>(false)

  // Comprueba si el formulario de subcategoría está activo
  isFormSubcategory = signal<boolean>(false)

  // Comprueba si el desplegable de gestión de subcategorías está activo
  isManageSubcategories = signal<boolean>(false)

  // Comprueba si el formulario de creación de categoría está activo
  isCreateCategory = signal<boolean>(false)

  // Loader
  tableLoader = signal<boolean>(false)

  // Formularios de filtro
  searchName = new FormControl('');
  searchType = new FormControl('');

  // Formulario de categoría y subcategoría
  categoryForm!: FormGroup
  subcategoryForm!: FormGroup

  // Categorías
  categories: Categories[] = []
  filteredCategories: Categories[] = []

  // Edición de categoría y subcategoría
  editingCategory: Categories | undefined
  editingSubcategory: BaseCategory | undefined
  selectedType: string | undefined

  // Servicio
  categoriesService = inject(CategoriesAndSubCategoriesService)
  readonly dialog = inject(MatDialog)
  notificationsService = inject(NotificacionesService)

  // Avisos formulario
  typeMessage: string = 'Type is required.'
  maxLengthMessage: string = 'Max length reached.'
  whiteSpaceMessage: string = 'Only whitespace is not allowed.'
  nameMessage: string = 'Name is required'

  // Máximo de longitud para las notas
  maxNotesLength: number = 30

  // Función para capitalizar strings
  capitalize = capitalizeString

  constructor() {

    this.categoryForm = new FormGroup({

      name: new FormControl('', [Validators.required, Validators.maxLength(30), whiteSpaceValidator]),

      color: new FormControl('', [Validators.required]),

    })

    this.subcategoryForm = new FormGroup({

      name: new FormControl('', [Validators.required, Validators.maxLength(30), whiteSpaceValidator]),

    })

  }

  ngOnInit(): void {

    this.tableLoader.set(true)

    this.categoriesService.getCategories(false).subscribe({
      next: (categories) => {

        this.categories = categories
        this.filteredCategories = categories

        this.tableLoader.set(false)

      },
      error: () => {

        this.tableLoader.set(false)

      }
    })

  }

  filterSearch(): void {

    const searchTerm = this.searchName.value?.trim().toLowerCase() || ''
    const selectedType = this.searchType.value || ''
  
    // Filtrar por tipo
    let categoriesFiltered = this.categories
    
    if (selectedType) {
      categoriesFiltered = categoriesFiltered.filter(category => category.type === selectedType)
    }
  
    // Aplicar filtro de búsqueda si hay un término
    this.filteredCategories = searchTerm ? filterAutocomplete(categoriesFiltered, searchTerm, ['name']) : categoriesFiltered

  }

  setEditCategory(category: Categories): void {

    this.editingCategory = category

    this.categoryForm.get('name')?.setValue(category.name)
    this.categoryForm.get('color')?.setValue(category.color)

  }

  setEditSubcategory(subcategory: BaseCategory): void {

    this.isFormSubcategory.set(true)

    this.editingSubcategory = subcategory

    this.subcategoryForm.get('name')?.setValue(subcategory.name)

  }

  resetCreateCategory(): void {

    this.isCreateCategory.set(false)

    this.categoryForm.reset()
    this.selectedType = undefined

  }


  resetEditCategory(): void {

    this.isEditCategory.set(false)

    this.categoryForm.reset()
    this.editingCategory = undefined

  }

  resetSubcategoryForm(): void {

    this.isFormSubcategory.set(false)

    this.subcategoryForm.reset()
    this.editingSubcategory = undefined

  }

  submitCreateCategory(): void {

    if (!this.categoryForm.valid) return

    this.addCategory()

    this.resetCreateCategory()
  }

  submitEditCategory(): void {

    if (!this.categoryForm.valid || !this.editingCategory) return
    
    this.updateCategory()

    this.resetEditCategory()

  }

  private updateCategory(): void {

    if (!this.editingCategory) return
  
    const editedCategory: Categories = {
      id: this.editingCategory.id,
      name: this.categoryForm.get('name')?.value,
      type: this.editingCategory.type,
      color: this.categoryForm.get('color')?.value,
      active: this.editingCategory.active,
      linked:this.editingCategory.linked,
      subcategories: this.editingCategory.subcategories
    }

    const index = this.filteredCategories.findIndex(
      (category) => category.id === this.editingCategory!.id
    )

    if (index !== -1) {

      this.saveCategory(editedCategory, index)

    } else {

      throw new Error("Category not found in table")

    }
  }
  
  private addCategory(): void {

    const newCategory: Categories = {
      name: this.categoryForm.get('name')?.value,
      type: this.selectedType || '',
      color: this.categoryForm.get('color')?.value,
      subcategories: [],
    }
  
    this.saveCategory(newCategory)

  }

  private saveCategory(categoryToSave: Categories, index?: number): void {

    this.categoriesService.saveCategory(categoryToSave).subscribe({
      next: (category: Categories) => {

        if(index !== undefined) {

          const indexCategories = this.categories.findIndex(category => category.id === categoryToSave.id)
          this.categories[indexCategories] = category
          this.filteredCategories[index] = category

        } else {

          this.categories.push(category)

        }

        this.showNotificationMessage('Category updated')

      }
    })

  }

  submitSubcategoryForm(): void {

    if (!this.subcategoryForm.valid) return
  
    this.editingSubcategory ? this.updateSubcategory() : this.addSubcategory()

    this.resetSubcategoryForm()

  }
  
  private updateSubcategory(): void {

    if (!this.editingSubcategory || !this.editingCategory) return
  
    const editedSubcategory: BaseCategory = {
      id: this.editingSubcategory.id,
      name: this.subcategoryForm.get('name')?.value,
      type: this.editingCategory.type,
    }
  
    const index = this.editingCategory.subcategories.findIndex(
      (subcategory) => subcategory.id === this.editingSubcategory!.id || subcategory.name === this.editingSubcategory!.name
    )
  
    if (index !== -1) {

      this.editingCategory.subcategories[index] = editedSubcategory
      this.updateCategory()

    } else {

      throw new Error(`Subcategory not found in: ${this.editingCategory.name} category`)

    }

  }
  
  private addSubcategory(): void {

    const newSubcategory: BaseCategory = {
      name: this.subcategoryForm.get('name')?.value,
      type: this.editingCategory!.type,
    }

    this.editingCategory?.subcategories.push(newSubcategory)
    this.updateCategory()

  }

  openActionDialog(entity: { id: number, name: string }, entityType: 'category' | 'subcategory', actionType: 'delete' | 'warning' | 'info'): void {

    let message: string = ''
    switch(actionType) {

      case 'delete':
        message = `Are you sure you want to delete the ${entityType}: ${entity.name}?`
        break
      case 'warning':
        message = `This action will not permanently delete the ${entityType}, but it will remove it from the selectors when managing income or expenses`
        break
      case 'info':
        message = `This action will restore the ${entityType}, making it available again in the selectors when managing income or expenses`
        break
      default:
        throw new Error('Action type not specified')
    }
  
    this.dialog.open(ActionDialogComponent, {
      data: {
        type: actionType,
        message,
        confirmButtonText: actionType === 'delete' ? 'Delete' : 'Continue',
        cancelButtonText: 'Go back'
      },
      maxWidth: '30vw'
    }).afterClosed().subscribe((isConfirmed: boolean) => {
      
      if (isConfirmed) {

        switch(actionType) {

          case 'delete':
            this.handleDeletion(entity.id, entityType)
            break
          case 'warning':
            this.handleDisable(entity.id)
            break
          case 'info':
            this.handleEnable(entity.id)
            break
          default:
            throw new Error('Action type not specified')
        }
        

      }

    });
  }
  
  private handleDeletion(id: number, entityType: 'category' | 'subcategory'): void {

    if (entityType === 'category') {

      this.categoriesService.deleteCategory(id).subscribe({
        next: (message: string) => {

          this.showNotificationMessage(message)

          this.categories = this.categories.filter(category => category.id !== id)
          this.filteredCategories = this.filteredCategories.filter(category => category.id !== id)

        }
      })

    } else {

      this.editingCategory?.subcategories.splice(this.editingCategory.subcategories.findIndex(subcategory => subcategory.id === id), 1)
      this.updateCategory()

    }

  }

  private handleDisable(id: number): void {

    this.categoriesService.disableCategory(id).subscribe({
      next: (message: string) => {

        const indexCategory = this.categories.findIndex(category => category.id === id)
        const category = this.categories.find(category => category.id === id)

        const indexFilteredCategory = this.filteredCategories.findIndex(category => category.id === id)

        if (indexCategory && indexFilteredCategory && category) {

          category.active = false
          this.categories[indexCategory] = category
          this.filteredCategories[indexFilteredCategory] = category

          this.showNotificationMessage(message)

        }

      }
    })

  }

  private handleEnable(id: number): void {

    this.categoriesService.enableCategory(id).subscribe({
      next: (message: string) => {

        const indexCategory = this.categories.findIndex(category => category.id === id)
        const category = this.categories.find(category => category.id === id)

        const indexFilteredCategory = this.filteredCategories.findIndex(category => category.id === id)

        if (indexCategory && indexFilteredCategory && category) {

          category.active = true
          this.categories[indexCategory] = category
          this.filteredCategories[indexFilteredCategory] = category

          this.showNotificationMessage(message)

        }

      }
    })

  }

  private showNotificationMessage(message: string): void {

    this.notificationsService.addNotification(
      message, 
      'success'
    )

  }

}
