import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { loginRoute } from 'src/app/shared/constants/variables.constants';

@Component({
  selector: 'app-presentacion',
  standalone: true,
  imports: [
    // Angular material
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './presentacion.component.html',
  styleUrl: './presentacion.component.scss'
})
export class PresentacionComponent {

  constructor(
    private router: Router
  ) {}

  redirectToLogin(): void {

    this.router.navigate([loginRoute])

  }
}
