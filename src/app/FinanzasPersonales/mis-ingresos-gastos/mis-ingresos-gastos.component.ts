import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SimboloDivisaPipe } from 'src/app/shared/pipes/SimboloDivisa/simbolo-divisa.pipe';
import { MisIngresosGastosFormularioComponent } from './mis-ingresos-gastos-formulario/mis-ingresos-gastos-formulario.component';
import { ActionType } from 'src/app/shared/enums/ActionType.enum';
import { IncomeOrExpense } from './IncomeOrExpense';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-mis-ingresos',
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
  templateUrl: './mis-ingresos-gastos.component.html',
  styleUrl: './mis-ingresos-gastos.component.scss'
})
export class MisIngresosGastosComponent {

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

  constructor() {}

  openDialog(actionType: string): void {



    this.dialog.open(MisIngresosGastosFormularioComponent, {

      data: {
        actionType: actionType,
        incomeOrExpense: null
      },
      minWidth: '50vh',
      maxWidth: '90vw',
      minHeight: '10vh',
      maxHeight: '80vh',

    }).afterClosed().subscribe(((record: IncomeOrExpense) => {



    }))

  }


}
