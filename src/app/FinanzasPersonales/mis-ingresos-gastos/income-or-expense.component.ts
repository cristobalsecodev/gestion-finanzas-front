import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { IncomeOrExpenseListComponent } from './income-or-expense-list/income-or-expense-list.component';

@Component({
  selector: 'app-income-or-expense',
  standalone: true,
  imports: [
    // Angular core
    // Angular material
    MatCardModule,
    // Componentes
    IncomeOrExpenseListComponent
  ],
  templateUrl: './income-or-expense.component.html',
  styleUrl: './income-or-expense.component.scss',
})
export class IncomeOrExpenseComponent {



}
