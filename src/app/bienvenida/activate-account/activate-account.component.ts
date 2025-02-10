import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { InputCodeComponent } from 'src/app/shared/components/input-code/input-code.component';
import { incomeExpensesRoute } from 'src/app/shared/constants/variables.constants';
import { EmailService } from 'src/app/shared/services/Email/email.service';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { StorageService } from 'src/app/shared/services/Storage/storage.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { UserService } from 'src/app/shared/services/Users/user.service';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [
    // Componentes
    InputCodeComponent,
    // Angular material
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent {

  wait = signal<boolean>(false)

  // Servicios
  private storageService = inject(StorageService)
  private tokenService = inject(TokenService)
  private notificationService = inject(NotificacionesService)
  private router = inject(Router)
  private userService = inject(UserService)
  private emailService = inject(EmailService)

  activateAccount(activationCode: string): void {

    // Servicio de activación de cuenta
    this.userService.activateAccount(activationCode).subscribe({
      next: (response) => {

        this.storageService.setSession('token', response.token)

        this.tokenService.startTokenCheck()

        this.notificationService.addNotification('Activated successfully', 'success')

        this.router.navigate([incomeExpensesRoute])


      }
    })

  }

  resendActivationCode(): void {

    this.wait.set(true)

    setTimeout(() => {

      this.wait.set(false)

    }, 7000)

    // Reenviar el código de activación
    this.emailService.sendActivationEmail().subscribe()

  }

}
