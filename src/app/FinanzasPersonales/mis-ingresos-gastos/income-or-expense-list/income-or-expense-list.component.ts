import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormatAmountPipe } from 'src/app/shared/pipes/FormatAmount/format-amount.pipe';
import { FormatThousandSeparatorsPipe } from 'src/app/shared/pipes/FormatThousandSeparators/format-thousand-separators.pipe';
import { CurrencySymbolPipe } from 'src/app/shared/pipes/SimboloDivisa/currency-symbol.pipe';
import { IncomeOrExpense } from '../interfaces.ts/IncomeOrExpense.interface';
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
import { MatChipListboxChange } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
export class IncomeOrExpenseListComponent {

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

  // Variables de paginación y lista
  currentPage = signal<number>(0)
  pageSize = signal<number>(10)
  totalElements = signal<number>(0)
  allRecords: IncomeOrExpense[] = []

  constructor(
    private incomeOrExpenseService: IncomeOrExpenseService,
    private notificationsService: NotificacionesService,
    private storageService: StorageService
  ) {

    // Filtro
    this.filterForm = new FormGroup({

      fromDate: new FormControl(''),

      toDate: new FormControl(''),

      type: new FormControl(''),

    })

    // Asigna el número registros en caso de que exista en el local
    const localStorageSize = this.storageService.getLocal('IEsize')

    if(Number(localStorageSize) && Number(localStorageSize) >= 5 && Number(localStorageSize) <= 30) {

      this.pageSize.set(Number(localStorageSize))

    }

    this.loadMore()

  }

  submitFilter(): void {

    console.log('filtrao')

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
      categories: undefined,
      endAmount: undefined,
      endDate: undefined,
      notes: undefined,
      recurrences: undefined,
      startAmount: undefined,
      startDate: undefined,
      subCategories: undefined,
      type: undefined

    }

    this.incomeOrExpenseService.getFilteredIncomeOrExpenses(buildFilter).subscribe({

      next: (records: PaginationData) => {

        if(records._embedded) {

          this.manageRecordsAndSort(records._embedded.incomeOrExpenseList)

        }

        this.totalElements.set(records.page.totalElements)

        // Incrementa la página para la próxima solicitud
        this.currentPage.set(this.currentPage() + 1)

      }
      
    })

  }

  manageRecordsAndSort(newRecords: IncomeOrExpense[]): void {

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

    // Ordena los registros
    this.groupByYear()

  }

  deleteRecord(id: number): void {

    this.allRecords = this.allRecords.filter(record => record.id !== id)

    // Ordena los registros
    this.groupByYear()

  }

  resetList(size: number): void {

    // Resetea los valores de la lista y paginación
    this.pageSize.set(size)

    this.storageService.setLocal('IEsize', this.pageSize().toString())

    this.currentPage.set(0)
    this.allRecords = []

    this.loadMore()

  }

  openIncomeOrExpenseDialog(actionType: string, incomeOrExpense?: IncomeOrExpense): void {

    this.dialog.open(IncomeOrExpenseFormComponent, {

      data: {
        actionType: actionType,
        incomeOrExpense: incomeOrExpense
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
