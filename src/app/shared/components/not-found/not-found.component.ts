import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { incomeExpensesRoute } from '../../constants/variables.constants';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    // Angular core
    RouterLink,
    // Angular material
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

  incomeExpensesRoute = incomeExpensesRoute

}
