import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SimboloDivisaPipe } from 'src/app/shared/pipes/SimboloDivisa/simbolo-divisa.pipe';
import { IncomeOrExpenseFormComponent } from './mis-ingresos-gastos-formulario/income-or-expense-form.component';
import { ActionType } from 'src/app/shared/enums/ActionType.enum';
import { IncomeOrExpense } from './interfaces.ts/IncomeOrExpense';
import { DatePipe, DecimalPipe, KeyValuePipe } from '@angular/common';
import { IncomeOrExpenseService } from './services/IncomeOrExpense/income-or-expense.service';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { MatMenuModule } from '@angular/material/menu';
import { capitalizeString } from 'src/app/shared/functions/Utils';

@Component({
  selector: 'app-income-or-expense',
  standalone: true,
  imports: [
    // Angular material
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
    // Pipes
    SimboloDivisaPipe,
    DatePipe,
    DecimalPipe,
    KeyValuePipe
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
      amount: 1200,
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
      category: 'Salario',
      subCategory: 'Trabajo',
      amount: 2500,
      currency: 'USD',
      type: 'income'
    },
    {
      id: 3,
      date: new Date('2024-05-20'),
      category: 'Comida',
      subCategory: 'Restaurante',
      amount: 500,
      currency: 'USD',
      type: 'expense'
    },
    {
      id: 4,
      date: new Date('2023-07-30'),
      category: 'Transporte',
      subCategory: 'Gasolina',
      amount: 150,
      currency: 'USD',
      type: 'expense'
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


}
