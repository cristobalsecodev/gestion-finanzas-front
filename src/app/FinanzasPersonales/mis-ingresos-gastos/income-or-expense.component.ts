import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CurrencySymbolPipe } from 'src/app/shared/pipes/SimboloDivisa/currency-symbol.pipe';
import { IncomeOrExpenseFormComponent } from './mis-ingresos-gastos-formulario/income-or-expense-form.component';
import { ActionType } from 'src/app/shared/enums/ActionType.enum';
import { IncomeOrExpense } from './interfaces.ts/IncomeOrExpense';
import { CommonModule, DatePipe, DecimalPipe, KeyValuePipe } from '@angular/common';
import { IncomeOrExpenseService } from './services/IncomeOrExpense/income-or-expense.service';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { MatMenuModule } from '@angular/material/menu';
import { capitalizeString } from 'src/app/shared/functions/Utils';
import { FormatAmountPipe } from 'src/app/shared/pipes/FormatAmount/format-amount.pipe';
import { FormatThousandSeparatorsPipe } from 'src/app/shared/pipes/FormatThousandSeparators/format-thousand-separators.pipe';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-income-or-expense',
  standalone: true,
  imports: [
    // Angular core
    CommonModule,
    // Angular material
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
    MatExpansionModule,
    // Pipes
    CurrencySymbolPipe,
    DatePipe,
    DecimalPipe,
    KeyValuePipe,
    FormatAmountPipe,
    FormatThousandSeparatorsPipe
  ],
  templateUrl: './income-or-expense.component.html',
  styleUrl: './income-or-expense.component.scss'
})
export class IncomeOrExpenseComponent {

  displayedColumns: string[] = ['date', 'category', 'amount', 'notes', 'actions']

  // TEST, ELIMINAR MOCKEOS
  items: IncomeOrExpense[] = [
    {
      id: 1,
      date: new Date('2024-02-15'),
      category: 'Alquiler',
      subCategory: 'Vivienda',
      amount: -1499.99,
      currency: 'USD',
      type: 'expense',
      recurrenceDetails: {
        recurrenceType: 'monthly',
        frequency: 1
      }
    },
    {
      id: 2,
      date: new Date('2023-03-10'),
      category: 'SalarioSalarioSalarioSalarioSalarioSalarioSalario',
      subCategory: 'SalarioSalarioSalarioSalarioSalarioSalarioSalario',
      amount: 250000,
      currency: 'CHF',
      type: 'income',
      recurrenceDetails: {
        recurrenceType: 'daily',
        frequency: 3
      }
    },
    {
      id: 3,
      date: new Date('2024-05-20'),
      category: 'Comida',
      subCategory: 'Restaurante',
      amount: -500,
      currency: 'EUR',
      type: 'expense'
    },
    {
      id: 4,
      date: new Date('2023-07-30'),
      category: 'Transporte',
      subCategory: 'Gasolina',
      amount: -150000000000000.40,
      currency: 'CAD',
      type: 'expense',
      recurrenceDetails: {
        recurrenceType: 'yearly',
        frequency: 5
      }
    },
    {
      id: 5,
      date: new Date('2022-12-05'),
      category: 'Transporte',
      subCategory: 'Gasolina',
      amount: 1050,
      currency: 'CNY',
      type: 'income'
    }
  ]

  groupedItems: { [year: number]: IncomeOrExpense[] } = {}
  sortedYears: number[] = []

  readonly actionType = ActionType

  readonly dialog = inject(MatDialog)

  constructor(
    private incomeOrExpenseService: IncomeOrExpenseService,
    private notificationsService: NotificacionesService
  ) {

    // TEST, QUITARLO DE AQUÍ
    this.groupByYear()

  }

  groupByYear(): void {
    this.items.forEach(item => {

      const year = new Date(item.date).getFullYear()

      if (!this.groupedItems[year]) {

        this.groupedItems[year] = []

      }

      this.groupedItems[year].push(item)

    })

    // Obtiene la clave (años) y los ordena en orden descendente
    this.sortedYears = Object.keys(this.groupedItems)
      .map(year => parseInt(year))
      .sort((a, b) => b - a)

  }

  loadMore(): void {



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
  
          next: () => {
  
            this.notificationsService.addNotification(
              `${capitalizeString(incomeOrExpense.type)} saved`, 
              'success'
            )
  
          }
  
        })

      }


    }))

  }

  shouldShowAmountTooltip(value: number): boolean {

    return Math.abs(value) > 1000

  }


}
