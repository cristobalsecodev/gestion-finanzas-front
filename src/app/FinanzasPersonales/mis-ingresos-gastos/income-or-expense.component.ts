import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SimboloDivisaPipe } from 'src/app/shared/pipes/SimboloDivisa/simbolo-divisa.pipe';
import { IncomeOrExpenseFormComponent } from './mis-ingresos-gastos-formulario/income-or-expense-form.component';
import { ActionType } from 'src/app/shared/enums/ActionType.enum';
import { IncomeOrExpense } from './IncomeOrExpense';
import { DatePipe, DecimalPipe } from '@angular/common';
import { IncomeOrExpenseService } from './service/income-or-expense.service';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';

@Component({
  selector: 'app-income-or-expense',
  standalone: true,
  imports: [
    // Angular material
    MatTableModule,
    MatCardModule,
    MatIcon,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    // Pipes
    SimboloDivisaPipe,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './income-or-expense.component.html',
  styleUrl: './income-or-expense.component.scss'
})
export class IncomeOrExpenseComponent {

  displayedColumns: string[] = ['date', 'category', 'amount', 'notes', 'actions']

  dataSource: IncomeOrExpense[] = [
    {
      date: new Date(),
      amount: 1000,
      category: 'Comida',
      subCategory: 'Cena',
      currency: 'CHF',
      type: 'income',
      notes: 'Lorem ipsum djqwkdnqwjkdnqkjdhnqsiod qkdj qwdjq wdjqwdoiq wdojqw doqjwdqowd qjwd qowjdqwdoqjdqowdj',
      recurrenceDetails: {
        recurrenceType: 'monthly',
        frequency: 1
      }
    }
  ]

  readonly actionType = ActionType

  readonly dialog = inject(MatDialog)

  constructor(
    private incomeOrExpenseService: IncomeOrExpenseService,
    private notificationsService: NotificacionesService
  ) {}

  openDialog(actionType: string): void {



    this.dialog.open(IncomeOrExpenseFormComponent, {

      data: {
        actionType: actionType,
        incomeOrExpense: null
      },
      minWidth: '50vh',
      maxWidth: '90vw',
      minHeight: '10vh',
      maxHeight: '80vh',

    }).afterClosed().subscribe(((incomeOrExpense: IncomeOrExpense) => {

      if(incomeOrExpense) {

        this.incomeOrExpenseService.saveIncomOrExpense(incomeOrExpense).subscribe({
  
          next: () => {
  
            this.notificationsService.addNotification(
              `${incomeOrExpense.type.charAt(0).toUpperCase() + incomeOrExpense.type.slice(1)} saved`, 
              'success'
            )
  
          }
  
        })

      }


    }))

  }


}
