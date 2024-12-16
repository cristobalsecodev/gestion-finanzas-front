import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormatAmountPipe } from 'src/app/shared/pipes/FormatAmount/format-amount.pipe';
import { FormatThousandSeparatorsPipe } from 'src/app/shared/pipes/FormatThousandSeparators/format-thousand-separators.pipe';
import { CurrencySymbolPipe } from 'src/app/shared/pipes/SimboloDivisa/currency-symbol.pipe';
import { BaseCategory, Categories, IncomeOrExpense } from '../interfaces.ts/IncomeOrExpense.interface';
import { ActionType } from 'src/app/shared/enums/ActionType.enum';
import { MatDialog } from '@angular/material/dialog';
import { IncomeOrExpenseService } from '../services/IncomeOrExpense/income-or-expense.service';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { StorageService } from 'src/app/shared/services/Storage/storage.service';
import { FilterIncomeOrExpense } from '../interfaces.ts/FilterIncomeOrExpense.interface';
import { PaginationData } from 'src/app/shared/interfaces/PaginationData.interface';
import { compareObjects } from 'src/app/shared/functions/CompareObjects';
import { IncomeOrExpenseFormComponent } from '../mis-ingresos-gastos-formulario/income-or-expense-form.component';
import { capitalizeString } from 'src/app/shared/functions/Utils';
import { ActionDialogComponent } from 'src/app/shared/components/dialogs/action-dialog/action-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { forkJoin } from 'rxjs';
import { CategoriesAndSubCategoriesService } from '../services/Categories&SubCategories/categories-and-sub-categories.service';
import { SelectGroup, SelectValue } from 'src/app/shared/interfaces/SelectGroup.interface';
import { CurrencyExchangeService } from 'src/app/shared/services/CurrencyExchange/currency-exchange.service';
import { invalidAmount } from 'src/app/shared/constants/validation-message.constants';
import { MatCheckboxModule } from '@angular/material/checkbox';
import moment from 'moment';
@Component({
  selector: 'app-income-or-expense-list',
  standalone: true,
  imports: [
    // Angular core
    CommonModule,
    ReactiveFormsModule,
    // Angular material
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatExpansionModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    // Pipes
    CurrencySymbolPipe,
    DatePipe,
    FormatAmountPipe,
    FormatThousandSeparatorsPipe
  ],
  animations: [
    // Animación para el componente de detalles
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'translateY(-30px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void <=> *', animate('80ms ease-in-out')),
    ])
  ],
  templateUrl: './income-or-expense-list.component.html',
  styleUrl: './income-or-expense-list.component.scss'
})
export class IncomeOrExpenseListComponent implements OnInit {

  // Formulario de filtro
  filterForm!: FormGroup

  groupedRecords: { [year: number]: IncomeOrExpense[] } = {}
  sortedYears: number[] = []

  // ID registro seleccionado
  selectedRecordId: number | null = null

  // Tipos de acciones
  readonly actionType = ActionType

  // Modal de ingresos / gastos
  readonly dialog = inject(MatDialog)

  // Función para capitalizar strings
  capitalize = capitalizeString

  // Variables de paginación y lista
  currentPage = signal<number>(0)
  pageSize = signal<number>(10)
  totalElements = signal<number>(0)
  allRecords: IncomeOrExpense[] = []

  // Categorías y subcategorías
  categories: Categories[] = []
  filteredCategories: Categories[] = []

  subcategories: SelectGroup[] = []
  filteredSubcategories: SelectGroup[] = []

  // Mensajes de validación
  readonly invalidAmount = invalidAmount

  constructor(
    private incomeOrExpenseService: IncomeOrExpenseService,
    private notificationsService: NotificacionesService,
    private storageService: StorageService,
    private categoriesService: CategoriesAndSubCategoriesService,
    public currencyExchangeService: CurrencyExchangeService
  ) {

    // Filtro
    this.filterForm = new FormGroup({

      fromDate: new FormControl(''),

      toDate: new FormControl(''),

      type: new FormControl(''),

      categories: new FormControl(''),

      subcategories: new FormControl({value: '', disabled: true}),

      fromAmount: new FormControl('', 
        [
          Validators.pattern('^\\d{1,15}(\\.\\d{1,2})?$'), // Acepta hasta 15 enteros y 2 decimales
          Validators.maxLength(18) 
        ]
      ),

      toAmount: new FormControl('',
        [
          Validators.pattern('^\\d{1,15}(\\.\\d{1,2})?$'), // Acepta hasta 15 enteros y 2 decimales
          Validators.maxLength(18) 
        ]
      ),

      recurrences: new FormControl(false)

    })

    // Asigna el número registros en caso de que exista en el local
    const localStorageSize = this.storageService.getLocal('IEsize')

    if(Number(localStorageSize) && Number(localStorageSize) >= 5 && Number(localStorageSize) <= 30) {

      this.pageSize.set(Number(localStorageSize))

    }

    this.loadMore()

  }

  ngOnInit(): void {
    
    this.callServices()
    
  }

  callServices(): void {

    forkJoin({
      categories: this.categoriesService.getCategories()
    }).subscribe({

      next: ({categories}) => {

        this.categories = categories
        this.filteredCategories = categories

      },

    })

  }

  onChangeChip(matChipChange: MatChipListboxChange): void {

    // Filtra las categorías por selección
    this.filterCategories(matChipChange.value)

    // Reinicia la subcategoría
    this.resetSubcategory()

  }

  filterCategories(type: 'income' | 'expense'): void {

    // Reinicia la categoría
    this.resetCategory()

    let categoriesFiltered: Categories[] | undefined
      
    categoriesFiltered = this.categories.filter(category => category.type === type)

    this.filteredCategories = categoriesFiltered && categoriesFiltered.length > 0 ? categoriesFiltered : this.categories

  }

  filterSubcategories(): void {

    // Reinicia la subcategoría
    this.resetSubcategory()

    let subcategoriesFiltered: SelectGroup[] = []

    if(this.filterForm.get('categories')?.value) {

      subcategoriesFiltered = this.filterForm.get('categories')?.value
        .filter((category: Categories) => category.subcategories && category.subcategories.length > 0)
        .map((category: Categories) => ({

        name: category.name,
        values: category.subcategories.map(subcategory => ({
          value: subcategory.id ?? 0,
          viewValue: subcategory.name

        }))

      }))

    }

    this.subcategories = subcategoriesFiltered ?? []
    this.filteredSubcategories = subcategoriesFiltered ?? []

    // Habilita el form de subcategoría en caso de que existan
    if (this.filteredSubcategories.length > 0) {

      this.filterForm.get('subcategories')?.enable();

    }

  }

  resetCategory(): void {

    // Reseta el form
    this.filterForm.get('categories')?.reset()

    // Vacía la lista filtrada
    this.filteredCategories = []

  }


  resetSubcategory(): void {

    // Reseta el form
    this.filterForm.get('subcategories')?.disable()
    this.filterForm.get('subcategories')?.reset()

    // Vacía las listas (dependen de la categoría)
    this.filteredSubcategories = []
    this.subcategories = []

  }

  groupByYear(): void {

    // Resetea el grouped records cada vez que se haga el cálculo
    this.groupedRecords = []

    this.allRecords.forEach(record => {

      const year = new Date(record.date).getFullYear()

      if (!this.groupedRecords[year]) {

        this.groupedRecords[year] = []

      }

      this.groupedRecords[year].push(record)

    })

    // Ordena los registros dentro de cada grupo por fecha (mes y día)
    Object.keys(this.groupedRecords).forEach((year: any) => {

      this.groupedRecords[year].sort((a, b) => {

        const dateA = new Date(a.date)
        const dateB = new Date(b.date)

        return dateB.getTime() - dateA.getTime()

      })

    })

    // Obtiene la clave (años) y los ordena en orden descendente
    this.sortedYears = Object.keys(this.groupedRecords)
      .map(year => parseInt(year))
      .sort((a, b) => b - a)

  }

  loadMore(): void {

    const buildFilter: FilterIncomeOrExpense = {

      page: this.currentPage(),
      size: this.pageSize(),
      sortDir: 'desc',
      categorySubcategoryMap: this.createCategoriesSubcategoriesObject(),
      fromAmount: this.filterForm.get('fromAmount')?.value
        ? Number(this.filterForm.get('fromAmount')?.value)
        : undefined,
      toAmount: this.filterForm.get('toAmount')?.value
        ? Number(this.filterForm.get('toAmount')?.value)
        : undefined,
      fromDate: this.filterForm.get('fromDate')?.value
        ? moment(this.filterForm.get('fromDate')?.value).format('YYYY-MM-DD')
        : undefined,
      toDate: this.filterForm.get('toDate')?.value
        ? moment(this.filterForm.get('toDate')?.value).format('YYYY-MM-DD')
        : undefined,
      recurrences: this.filterForm.get('recurrences')?.value
        ? this.filterForm.get('recurrences')?.value
        : undefined,
      type: this.filterForm.get('type')?.value
        ? this.filterForm.get('type')?.value
        : undefined

    }

    this.incomeOrExpenseService.getFilteredIncomeOrExpenses(buildFilter).subscribe({

      next: (records: PaginationData) => {

        this.manageRecordsAndSort(records._embedded ? records._embedded.incomeOrExpenseList : [])

        this.totalElements.set(records.page.totalElements)

        // Incrementa la página para la próxima solicitud
        this.currentPage.set(this.currentPage() + 1)

      }
      
    })

  }

  createCategoriesSubcategoriesObject(): any[] {

    // Obtener los ids seleccionados
    const selectedCategoryIds = this.filterForm.get('categories')?.value && this.filterForm.get('categories')?.value.length > 0 
      ? this.filterForm.get('categories')?.value.map((category: BaseCategory) => category.id)
      : []

    const selectedSubcategoryIds = this.filterForm.get('subcategories')?.value && this.filterForm.get('subcategories')?.value.length > 0 
      ? this.filterForm.get('subcategories')?.value.map((subcategory: SelectValue) => subcategory.value)
      : []
  
    // Crear el objeto resultante
    const result = selectedCategoryIds.map((categoryId: number) => {

      const category = this.categories.find(c => c.id === categoryId)
      
      if (!category) return { category: categoryId, subcategories: [] } // Si no se encuentra la categoría, devolver un objeto vacío con subcategorías vacías
  
      // Filtrar las subcategorías seleccionadas para la categoría actual
      const selectedSubcategories = category.subcategories.filter(subcategory =>
        selectedSubcategoryIds.includes(subcategory.id)
      ).map(subcategory => subcategory.id)
  
      return {
        category: categoryId,
        subcategories: selectedSubcategories
      }

    })
  
    return result

  }

  manageRecordsAndSort(newRecords: IncomeOrExpense[]): void {

    if(newRecords.length !== 0) {

      // Comprueba si el mismo registro ha sido modificado
      this.allRecords = this.allRecords.map(existingRecord => {

        // Encuentra un registro con la misma ID
        const updatedRecord = newRecords.find(newRecord => newRecord.id === existingRecord.id)
      
        // Si se encuentra y es diferente, actualiza el registro existente
        if (updatedRecord && !compareObjects(existingRecord, updatedRecord)) {

          // Actualiza con los nuevos datos
          return updatedRecord

        }

        // Mantiene el registro actual
        return existingRecord

      });

      // Apila los datos con los nuevos evitando duplicados
      this.allRecords = [
        ...this.allRecords, 
        ...newRecords.filter(newRecord => 
          !this.allRecords.some(existingRecord => compareObjects(existingRecord, newRecord))
        )
      ]

    } else {

      this.allRecords = []

    }



    // Ordena los registros
    this.groupByYear()

  }

  deleteRecord(id: number): void {

    this.allRecords = this.allRecords.filter(record => record.id !== id)

    // Ordena los registros
    this.groupByYear()

  }

  resetFilter(): void {

    this.filterForm.reset({hasNotes: 'N/A'})

    this.filteredCategories = this.categories
    this.filteredSubcategories = this.subcategories

    this.resetList()

  }

  resetList(size: number = 10): void {

    // Resetea los valores de la lista y paginación
    this.pageSize.set(size)

    this.storageService.setLocal('IEsize', this.pageSize().toString())

    this.currentPage.set(0)
    this.allRecords = []

    console.log(this.filterForm)

    this.loadMore()

  }

  openIncomeOrExpenseDialog(actionType: string, incomeOrExpense?: IncomeOrExpense): void {

    this.dialog.open(IncomeOrExpenseFormComponent, {

      data: {
        actionType: actionType,
        incomeOrExpense: incomeOrExpense,
        categories: this.categories
      },
      minWidth: '50vh',
      maxWidth: '90vw',
      minHeight: '10vh',
      maxHeight: '80vh',

    }).afterClosed().subscribe(((incomeOrExpense: IncomeOrExpense) => {

      if(incomeOrExpense) {

        this.incomeOrExpenseService.saveIncomeOrExpense(incomeOrExpense).subscribe({

          next: (id: number) => {

            this.notificationsService.addNotification(
              `${capitalizeString(incomeOrExpense.type)} saved`, 
              'success'
            )

            // Asigna el ID creado
            incomeOrExpense.id = id

            this.manageRecordsAndSort([incomeOrExpense])

            this.totalElements.set(this.totalElements() + 1)

          }

        })

      }

    }))

  }

  openDeleteDialog(incomeOrExpense: IncomeOrExpense): void {

    const recurrenceMessage = incomeOrExpense.recurrenceDetails 
      ? `. If this is the only ${incomeOrExpense.type} registered, the recurrence will be deleted too.` 
      : ''

    this.dialog.open(ActionDialogComponent, {

      data: {
        type: 'delete',
        message: `Are you sure you want to delete this ${incomeOrExpense.type}?${recurrenceMessage}`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Go back'
      },
      maxWidth: '30vw'

    }).afterClosed().subscribe(((isConfirmed: boolean) => {

      if(isConfirmed) {

        this.incomeOrExpenseService.deleteIncomeOrExpense(incomeOrExpense.id!).subscribe({
  
          next: (message: string) => {

            this.notificationsService.addNotification(message, 'success')

            this.deleteRecord(incomeOrExpense.id!)

            this.totalElements.set(this.totalElements() - 1)

          }
  
        })

      }


    }))

  }

  toggleDetails(recordId: number): void {

    this.selectedRecordId = this.selectedRecordId === recordId ? null : recordId

  }

  shouldShowAmountTooltip(value: number): boolean {

    return Math.abs(value) > 1000

  }

  getRecurrenceMessage(recurrenceType: 'daily' | 'weekly' | 'monthly' | 'yearly', frequency: number) {

    if(frequency <= 0) {

      this.notificationsService.addNotification('How do you managed to get a frequency lesser than 0?', 'warning')

      throw new Error("Frequency muyst be a positive number")

    }

    const recurrenceMap: Record<string, { singular: string; plural: string }> = {

      daily: { singular: 'day', plural: 'days' },
      weekly: { singular: 'week', plural: 'weeks' },
      monthly: { singular: 'month', plural: 'months' },
      yearly: { singular: 'year', plural: 'years' }

    }

    const recurrence = recurrenceMap[recurrenceType]

    if(!recurrence) {

      this.notificationsService.addNotification('How do you managed to get an invalid recurrence type?', 'warning')

      throw new Error('Invalid recurrence type')

    }

    const unit = frequency === 1 ? recurrence.singular : recurrence.plural

    return `The recurrence occurs every ${frequency} ${unit}.`

  }

}
