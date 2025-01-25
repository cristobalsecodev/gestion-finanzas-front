import { Component, computed } from '@angular/core';
import { allRecordsSignal } from '../utils/SharedList';

@Component({
  selector: 'app-income-or-expense-statistics',
  standalone: true,
  imports: [],
  templateUrl: './income-or-expense-statistics.component.html',
  styleUrl: './income-or-expense-statistics.component.scss'
})
export class IncomeOrExpenseStatisticsComponent {

  allRecords = computed(() => allRecordsSignal())

  constructor() { }

  ngOnInit(): void {



  }


}
