import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
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
import { ActionDialogComponent } from 'src/app/shared/components/dialogs/action-dialog/action-dialog.component';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { CommonModule } from '@angular/common';
import { whiteSpaceValidator } from 'src/app/shared/functions/Validators';

@Component({
  selector: 'app-categories-subcategories-form',
  standalone: true,
  imports: [
    // Angular core
    ReactiveFormsModule,
    CommonModule,
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
    MatButtonModule,
    MatDialogModule
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

  // Comprueba la acción el formulario de categoría
  actionTypeCategory = signal<ActionType | undefined>(undefined)

  // Comprueba la acción el formulario de subcategoría
  actionTypeSubcategory = signal<ActionType | undefined>(undefined)

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

  // Servicio
  categoriesService = inject(CategoriesAndSubCategoriesService)
  readonly dialog = inject(MatDialog)
  notificationsService = inject(NotificacionesService)

  // Tablas
  columnsCategory: string[] = ['name', 'type', 'actions']
  columnsSubcategory: string[] = ['name', 'actions']
  dataSourceCategories = new MatTableDataSource<Categories>([])
  dataSourceSubcategories = new MatTableDataSource<BaseCategory>([])

  // Avisos formulario
  typeMessage: string = 'Type is required.'
  maxLengthMessage: string = 'Max length reached.'
  whiteSpaceMessage: string = 'Only whitespace is not allowed.'
  nameMessage: string = 'Name is required'

  // Función para capitalizar strings
  capitalize = capitalizeString

  constructor() {

    this.categoryForm = new FormGroup({

      name: new FormControl('', [Validators.required, Validators.maxLength(30), whiteSpaceValidator]),
      
      type: new FormControl('', [Validators.required]),

      color: new FormControl('', [Validators.required]),

    })

    this.subcategoryForm = new FormGroup({

      name: new FormControl('', [Validators.required, Validators.maxLength(30), whiteSpaceValidator]),

    })

    effect(() => {

      this.categoryForm.reset()
      this.subcategoryForm.reset()

    })


  }

  ngOnInit(): void {

    this.categoriesService.getCategories(false).subscribe({
      next: (categories) => {

        this.categories = categories
        this.dataSourceCategories.data = categories

      }
    })

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

  setEditCategory(category: Categories): void {

    this.isFormCategory.set(true)
    this.actionTypeCategory.set(this.actionTypes.EDIT)

    this.editingCategory = category

    this.categoryForm.get('name')?.setValue(category.name)
    this.categoryForm.get('type')?.setValue(category.type)
    this.categoryForm.get('color')?.setValue(category.color)

    if(category.linked) {

      this.categoryForm.get('type')?.disable()

    }

    this.dataSourceSubcategories.data = category.subcategories

  }

  setEditSubcategory(subcategory: BaseCategory): void {

    this.isFormSubcategory.set(true)
    this.actionTypeSubcategory.set(this.actionTypes.EDIT)

    this.editingSubcategory = subcategory

    this.subcategoryForm.get('name')?.setValue(subcategory.name)

  }

  resetCategoryForm(): void {

    this.isFormCategory.set(false)
    this.actionTypeCategory.set(undefined)

    this.categoryForm.reset()
    this.editingCategory = undefined

  }

  resetSubcategoryForm(): void {

    this.isFormSubcategory.set(false)
    this.actionTypeSubcategory.set(undefined)

    this.subcategoryForm.reset()
    this.editingSubcategory = undefined

  }


  submitCategoryForm(): void {

    if (!this.categoryForm.valid) return
    
    this.editingCategory ? this.updateCategory() : this.addCategory()

    this.dataSourceSubcategories.data = []
    this.updateSubcategoryTable()

    this.resetCategoryForm()

  }
  
  private updateCategory(): void {

    if (!this.editingCategory) return
  
    const editedCategory: Categories = {
      id: this.editingCategory.id,
      name: this.categoryForm.get('name')?.value,
      type: this.categoryForm.get('type')?.value,
      color: this.categoryForm.get('color')?.value,
      active: this.editingCategory.active,
      linked:this.editingCategory.linked,
      subcategories: this.dataSourceSubcategories.data.map(subcategory => ({ ...subcategory, type: this.categoryForm.get('type')?.value })),
    }
  
    const index = this.dataSourceCategories.data.findIndex(
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
      type: this.categoryForm.get('type')?.value,
      color: this.categoryForm.get('color')?.value,
      subcategories: this.dataSourceSubcategories.data.map(subcategory => ({ ...subcategory, type: this.categoryForm.get('type')?.value })),
    }
  
    this.saveCategory(newCategory)

  }

  private saveCategory(categoryToSave: Categories, index?: number): void {

    this.categoriesService.saveCategory(categoryToSave).subscribe({
      next: (category: Categories) => {

        if(index !== undefined) {

          this.dataSourceCategories.data[index] = category

        } else {

          this.dataSourceCategories.data.push(category)

        }

        this.updateCategoryTable()

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
      type: this.editingSubcategory.type,
    }
  
    const index = this.dataSourceSubcategories.data.findIndex(
      (subcategory) => subcategory.id === this.editingSubcategory!.id || subcategory.name === this.editingSubcategory!.name
    )
  
    if (index !== -1) {

      this.dataSourceSubcategories.data[index] = editedSubcategory

    } else {

      throw new Error(`Subcategory not found in: ${this.editingCategory.name} category`)

    }

  }
  
  private addSubcategory(): void {

    const newSubcategory: BaseCategory = {
      name: this.subcategoryForm.get('name')?.value,
      type: '',
    }
  
    this.dataSourceSubcategories.data.push(newSubcategory)

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

          this.dataSourceCategories.data = this.dataSourceCategories.data.filter(category => category.id !== id)
          this.updateCategoryTable()

        }
      })

    } else {

      this.dataSourceSubcategories.data = this.dataSourceSubcategories.data.filter(subcategory => subcategory.id !== id)

    }

  }

  private handleDisable(id: number): void {

    this.categoriesService.disableCategory(id).subscribe({
      next: (message: string) => {

        const category = this.dataSourceCategories.data.find(category => category.id === id)

        if (category) {

          category.active = false
          this.updateCategoryTable()

          this.showNotificationMessage(message)

        }

      }
    })

  }

  private handleEnable(id: number): void {

    this.categoriesService.enableCategory(id).subscribe({
      next: (message: string) => {

        const category = this.dataSourceCategories.data.find(category => category.id === id)

        if (category) {

          category.active = true
          this.updateCategoryTable()

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
  
  private updateCategoryTable(): void {

    this.dataSourceCategories.data = [...this.dataSourceCategories.data]

  }

  private updateSubcategoryTable(): void {

    this.dataSourceSubcategories.data = [...this.dataSourceSubcategories.data]

  }
  
}
