import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { signUpRoute, loginRoute, webName } from 'src/app/shared/constants/variables.constants';
import { TokenService } from 'src/app/shared/services/token/token.service';

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

  // Rutas
  readonly loginRoute = loginRoute
  readonly signUpRoute = signUpRoute

  // Nombre de la web
  readonly webName = webName

  // Texto de info
  readonly subject = 'Financia Sphere is your all-in-one solution for personal finance management. Seamlessly organize and track your income, expenses, assets, and investments, empowering you to make informed decisions and achieve your financial goals.'

  // Servicios
  public tokenService = inject(TokenService)

}
