import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { signUpRoute, loginRoute } from 'src/app/shared/constants/variables.constants';

@Component({
  selector: 'app-presentacion',
  standalone: true,
  imports: [
    // Angular core
    RouterLink,
    // Angular material
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './presentacion.component.html',
  styleUrl: './presentacion.component.scss'
})
export class PresentacionComponent {

  readonly loginRoute = loginRoute
  readonly signUpRoute = signUpRoute

  constructor() {}

}
