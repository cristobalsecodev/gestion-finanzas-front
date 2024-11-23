import { Component, effect, inject, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CurrencySymbolPipe } from 'src/app/shared/pipes/SimboloDivisa/currency-symbol.pipe';
import { IncomeOrExpenseFormComponent } from './mis-ingresos-gastos-formulario/income-or-expense-form.component';
import { ActionType } from 'src/app/shared/enums/ActionType.enum';
import { IncomeOrExpense } from './interfaces.ts/IncomeOrExpense.interface';
import { CommonModule, DatePipe } from '@angular/common';
import { IncomeOrExpenseService } from './services/IncomeOrExpense/income-or-expense.service';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { MatMenuModule } from '@angular/material/menu';
import { capitalizeString } from 'src/app/shared/functions/Utils';
import { FormatAmountPipe } from 'src/app/shared/pipes/FormatAmount/format-amount.pipe';
import { FormatThousandSeparatorsPipe } from 'src/app/shared/pipes/FormatThousandSeparators/format-thousand-separators.pipe';
import { MatExpansionModule } from '@angular/material/expansion';
import  {MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { StorageService } from 'src/app/shared/services/Storage/storage.service';
import { FilterIncomeOrExpense } from './interfaces.ts/FilterIncomeOrExpense.interface';
import { compareObjects } from 'src/app/shared/functions/CompareObjects';

@Component({
  selector: 'app-income-or-expense',
  standalone: true,
  imports: [
    // Angular core
    CommonModule,
    FormsModule,
    // Angular material
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
    MatExpansionModule,
    MatBottomSheetModule,
    MatFormFieldModule,
    MatSelectModule,
    // Pipes
    CurrencySymbolPipe,
    DatePipe,
    FormatAmountPipe,
    FormatThousandSeparatorsPipe
  ],
  templateUrl: './income-or-expense.component.html',
  styleUrl: './income-or-expense.component.scss',
  animations: [
    // Animación para el componente de detalles
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'translateY(-30px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void <=> *', animate('80ms ease-in-out')),
    ])
  ],
})
export class IncomeOrExpenseComponent {

  groupedRecords: { [year: number]: IncomeOrExpense[] } = {}
  sortedYears: number[] = []

  // ID registro seleccionado
  selectedRecordId: number | null = null

  // Tipos de acciones
  readonly actionType = ActionType

  // Modal de ingresos / gastos
  readonly dialog = inject(MatDialog)

  // Variables de paginación y lista
  currentPage: number = 0
  pageSize = signal<number>(10)
  allRecords: IncomeOrExpense[] = []

  constructor(
    private incomeOrExpenseService: IncomeOrExpenseService,
    private notificationsService: NotificacionesService,
    private storageService: StorageService
  ) {

    // Asigna el número registros en caso de que exista en el local
    const localStorageSize = this.storageService.getLocal('IEsize')

    if(Number(localStorageSize) && Number(localStorageSize) >= 5 && Number(localStorageSize) <= 30) {

      this.pageSize.set(Number(localStorageSize))

    }

    effect(() => {

      this.storageService.setLocal('IEsize', this.pageSize().toString())

      this.resetList()

      this.loadMore()

    })

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

      page: this.currentPage,
      size: this.pageSize(),
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

      next: (records: IncomeOrExpense[]) => {

        this.manageRecordsAndSort(records)

        // Incrementa la página para la próxima solicitud
        this.currentPage++

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

  resetList(): void {

    // Resetea los valores de la lista y paginación
    this.currentPage = 0
    this.allRecords = []

  }

  openDialog(actionType: string, incomeOrExpense?: IncomeOrExpense): void {

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
