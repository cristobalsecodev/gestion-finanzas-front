import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormatAmountPipe } from 'src/app/shared/pipes/FormatAmount/format-amount.pipe';
import { FormatThousandSeparatorsPipe } from 'src/app/shared/pipes/FormatThousandSeparators/format-thousand-separators.pipe';
import { CurrencySymbolPipe } from 'src/app/shared/pipes/SimboloDivisa/currency-symbol.pipe';
import { BaseCategory, Categories, IncomeOrExpense } from '../interfaces/IncomeOrExpense.interface';
import { IncomeOrExpenseService } from '../services/IncomeOrExpense/income-or-expense.service';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { StorageService } from 'src/app/shared/services/Storage/storage.service';
import { FilterIncomeOrExpense } from '../interfaces/FilterIncomeOrExpense.interface';
import { PaginationData } from 'src/app/shared/interfaces/PaginationData.interface';
import { compareObjects } from 'src/app/shared/functions/CompareObjects';
import { capitalizeString } from 'src/app/shared/functions/Utils';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoriesAndSubCategoriesService } from '../services/Categories&SubCategories/categories-and-sub-categories.service';
import { SelectGroup, SelectValue } from 'src/app/shared/interfaces/SelectGroup.interface';
import { CurrencyExchangeService } from 'src/app/shared/services/CurrencyExchange/currency-exchange.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import moment from 'moment';
import { allCategories, allTransactions, incomeOrExpenseToEdit } from '../utils/SharedList';
import { Router } from '@angular/router';
import { categoriesRoute, incomeExpensesFormRoute } from 'src/app/shared/constants/variables.constants';
import { ActionDialogService } from 'src/app/shared/services/Dialogs/action-dialog.service';

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
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    // Pipes
    CurrencySymbolPipe,
    DatePipe,
    FormatAmountPipe,
    FormatThousandSeparatorsPipe
  ],
  animations: [
    trigger('slideInOut', [
      state('void', style({
        height: '0',
        overflow: 'hidden',
        padding: '0 20px',
        opacity: '0'
      })),
      state('*', style({
        height: '*',
        overflow: 'hidden',
        padding: '15px 20px',
        opacity: '1'
      })),
      transition('void <=> *', animate('300ms ease-in-out'))
    ]),
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ],
  templateUrl: './income-or-expense-list.component.html',
  styleUrl: './income-or-expense-list.component.scss'
})
export class IncomeOrExpenseListComponent implements OnInit {

  // Despliega y contrae el filtro
  filtersOpen = signal<boolean>(false)

  // Formulario de filtro
  filterForm!: FormGroup

  groupedRecords: { [year: number]: IncomeOrExpense[] } = {}
  sortedYears: number[] = []

  // ID registro seleccionado
  selectedRecordId: number | null = null

  // Servicios
  currencyExchangeService = inject(CurrencyExchangeService)
  incomeOrExpenseService = inject(IncomeOrExpenseService)
  categoriesService = inject(CategoriesAndSubCategoriesService)
  notificationsService = inject(NotificacionesService)
  router = inject(Router)
  dialog = inject(ActionDialogService)

  // Función para capitalizar strings
  capitalize = capitalizeString

  // Variables de paginación y lista
  currentPage = signal<number>(0)
  pageSize = signal<number>(10)
  totalElements = signal<number>(0)
  originalCurrencyRecords: IncomeOrExpense[] = []
  recordsToShow: IncomeOrExpense[] = []

  // Categorías y subcategorías
  categories: Categories[] = []
  filteredCategories: Categories[] = []

  subcategories: SelectGroup[] = []
  filteredSubcategories: SelectGroup[] = []

  // Loader
  filterLoader = signal<boolean>(false)

  // Controla el menú desplegable de divisas
  dropdownOpen = false

  constructor(
    private storageService: StorageService
  ) {

    // Filtro
    this.filterForm = new FormGroup({

      fromDate: new FormControl(''),

      toDate: new FormControl(''),

      type: new FormControl(''),

      categories: new FormControl(''),

      subcategories: new FormControl({value: '', disabled: true}),

      currencies: new FormControl(''),

      recurrences: new FormControl(false)

    })

    // Asigna el número registros en caso de que exista en el local
    const localStorageSize = this.storageService.getLocal('IEsize')

    if(Number(localStorageSize) && Number(localStorageSize) >= 5 && Number(localStorageSize) <= 30) {

      this.pageSize.set(Number(localStorageSize))

    }

  }

  ngOnInit(): void {
    
    this.getCategories()

    this.getFilteredIncomeOrExpenses(this.buildFilter())
    
  }

  getCategories(): void {

    this.categoriesService.getCategories(false).subscribe({
      next: (categories) => {

        allCategories.set(categories)
        this.categories = categories
        this.filteredCategories = categories

      }
    })

  }

  onChangeSelect(matSelectChange: MatSelectChange): void {

    // Filtra las categorías por selección
    this.filterCategories(matSelectChange.value)

    // Reinicia la subcategoría
    this.resetSubcategory()

  }

  filterCategories(type: 'income' | 'expense' | ''): void {

    // Reinicia la categoría
    this.resetCategory()

    if (type === '') {

      this.filteredCategories = this.categories

    } else {

      this.filteredCategories = this.categories.filter(category => category.type === type)
      
    }

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

    this.recordsToShow.forEach(record => {

      const year = new Date(record.transactionDate).getFullYear()

      if (!this.groupedRecords[year]) {

        this.groupedRecords[year] = []

      }

      this.groupedRecords[year].push(record)

    })

    // Ordena los registros dentro de cada grupo por fecha (mes y día)
    Object.keys(this.groupedRecords).forEach((year: any) => {

      this.groupedRecords[year].sort((a, b) => {

        const dateA = new Date(a.transactionDate)
        const dateB = new Date(b.transactionDate)

        return dateB.getTime() - dateA.getTime()

      })

    })

    // Obtiene la clave (años) y los ordena en orden descendente
    this.sortedYears = Object.keys(this.groupedRecords)
      .map(year => parseInt(year))
      .sort((a, b) => b - a)

  }

  buildFilter(allRecords?: boolean): FilterIncomeOrExpense {

    return {

      page: this.currentPage(),
      size: this.pageSize(),
      sortDir: 'desc',
      categories: this.filterForm.get('categories')?.value && this.filterForm.get('categories')?.value.length > 0
        ? this.filterForm.get('categories')?.value.map((subcategory: BaseCategory) => subcategory.id)
        : undefined,
      subcategories: this.filterForm.get('subcategories')?.value && this.filterForm.get('subcategories')?.value.length > 0
        ? this.filterForm.get('subcategories')?.value.map((subcategory: SelectValue) => subcategory.value)
        : undefined,
      currencies: this.filterForm.get('currencies')?.value
        ? this.filterForm.get('currencies')?.value
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
        : undefined,
      allRecords: allRecords ? allRecords : false

    }

  }

  getFilteredIncomeOrExpenses(buildFilter: FilterIncomeOrExpense): void {

    this.filterLoader.set(true)

    this.incomeOrExpenseService.getFilteredIncomeOrExpenses(buildFilter).subscribe({

      next: (records: PaginationData) => {

        this.manageRecordsAndSort(
          records._embedded ? records._embedded.incomeOrExpenseList : []
        )

        this.totalElements.set(records.page.totalElements)

        // Incrementa la página para la próxima solicitud
        this.currentPage.set(this.currentPage() + 1)

        this.filterLoader.set(false)

      },
      error: () => {

        this.filterLoader.set(false)

      }

    })

  }

  manageRecordsAndSort(newRecords: IncomeOrExpense[]): void {

    if(newRecords.length !== 0) {

      // Comprueba si el mismo registro ha sido modificado
      this.recordsToShow = this.recordsToShow.map(existingRecord => {

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
      this.recordsToShow = [
        ...this.recordsToShow, 
        ...newRecords.filter(newRecord => 
          !this.recordsToShow.some(existingRecord => compareObjects(existingRecord, newRecord))
        )
      ]

    } else {

      this.recordsToShow = []

    }

    // Actualiza el signal
    allTransactions.set(this.recordsToShow)

    // Ordena los registros
    this.groupByYear()

  }

  deleteRecord(id: number): void {

    this.recordsToShow = this.recordsToShow.filter(record => record.id !== id)

    // Actualiza el signal
    allTransactions.set(this.recordsToShow)

    // Ordena los registros
    this.groupByYear()

  }

  resetFilter(): void {

    this.filterForm.reset({hasNotes: 'N/A'})

    this.filteredCategories = this.categories
    this.filteredSubcategories = this.subcategories

    this.filterList()

  }

  filterList(size: number = 10): void {

    // Cierra el dropdown
    this.dropdownOpen = false
    
    // Actualiza la clase del dropdown
    const dropdown = document.getElementById('size-dropdown-menu')

    if (dropdown) {
      dropdown.classList.remove('show-dropdown-menu')
    } 

    // Resetea los valores de la lista y paginación
    this.pageSize.set(size)

    this.storageService.setLocal('IEsize', this.pageSize().toString())

    this.currentPage.set(0)

    this.recordsToShow = []
    allTransactions.set(this.recordsToShow)

    this.getFilteredIncomeOrExpenses(this.buildFilter())

  }

  newTransaction(): void {

    this.router.navigate([incomeExpensesFormRoute])

  }

  editTransaction(incomeOrExpense: IncomeOrExpense): void {

    incomeOrExpenseToEdit.set(incomeOrExpense)
    this.router.navigate([incomeExpensesFormRoute])

  }

  goToCategories(): void {

    this.router.navigate([categoriesRoute])

  }

  deleteTransaction(incomeOrExpense: IncomeOrExpense): void {

    const recurrenceMessage = incomeOrExpense.recurrenceDetails 
      ? `. If this is the only ${incomeOrExpense.type} registered, the recurrence will be deleted too.` 
      : ''

    this.dialog.openDeleteModal(
      'Delete',
      `Are you sure you want to delete this ${incomeOrExpense.type}?${recurrenceMessage}`,
      () => {

        this.incomeOrExpenseService.deleteIncomeOrExpense(incomeOrExpense.id!).subscribe({
  
          next: (message: string) => {

            this.notificationsService.addNotification(message, 'success')

            this.deleteRecord(incomeOrExpense.id!)

            this.totalElements.set(this.totalElements() - 1)

          }
  
        })

      }
    )

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

    return `Every ${frequency} ${unit}`

  }

  toggleFilters(): void {

    this.filtersOpen.update(value => !value)

  }

  toggleDropdown(event: MouseEvent) {
    
    this.dropdownOpen = !this.dropdownOpen
    event.stopPropagation()
  
    const dropdown = document.getElementById('size-dropdown-menu')
    const button = document.getElementById('button-dropdown')
    
    if (dropdown && button) {

      if (this.dropdownOpen) {

        // Calcular su altura
        dropdown.style.visibility = 'hidden'
        dropdown.classList.add('show-dropdown-menu')
        const dropdownHeight = dropdown.offsetHeight
        
        // Obtener la posición del botón
        const buttonRect = button.getBoundingClientRect()
        
        // Calcular espacio disponible
        const windowHeight = window.innerHeight
        const spaceBelow = windowHeight - buttonRect.bottom
        
        // Determinar si debe abrirse hacia arriba o hacia abajo
        if (spaceBelow < dropdownHeight && buttonRect.top > dropdownHeight) {

          // Abrir hacia arriba - posicionar por encima del botón
          dropdown.style.left = buttonRect.left + 'px'
          dropdown.style.top = 'auto'
          dropdown.style.bottom = (windowHeight - buttonRect.top + 4) + 'px'

        } else {

          // Abrir hacia abajo - posicionar por debajo del botón
          dropdown.style.left = buttonRect.left + 'px'
          dropdown.style.top = (buttonRect.bottom + 4) + 'px'
          dropdown.style.bottom = 'auto'

        }
        
        dropdown.style.width = buttonRect.width + 'px'
        dropdown.style.visibility = 'visible'

      } else {
        dropdown.classList.remove('show-dropdown-menu')
      }
    }
  }

  // Cierra el dropdown si se hace clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {

    // Si el dropdown no está abierto, no hace nada
    if (!this.dropdownOpen) return
    
    const target = event.target as HTMLElement
  
    // Referencia el dropdown
    const dropdown = document.getElementById('size-dropdown-menu')
    
    // Verifica el botón que abre el dropdown
    const dropdownButton = document.getElementById('button-dropdown')
    
    // Comprueba si el clic fue dentro del dropdown o en el botón
    const clickedInDropdown = dropdown && dropdown.contains(target)
    const clickedOnButton = dropdownButton && dropdownButton.contains(target)
    
    // Solo cierra si el clic fue fuera de ambos elementos
    if (!clickedInDropdown && !clickedOnButton && this.dropdownOpen) {
      this.dropdownOpen = false
      
      if (dropdown) {
        dropdown.classList.remove('show-dropdown-menu')
      }
      
      event.stopPropagation()
    }
  }

}
