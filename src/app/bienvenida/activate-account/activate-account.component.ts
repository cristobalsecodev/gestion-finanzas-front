import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InputCodeComponent } from 'src/app/shared/components/input-code/input-code.component';
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

  constructor(
    private userService: UserService
  ) {}

  activateAccount(activationCode: string): void {

    // Servicio de activación de ceunta
    this.userService.activateAccount(activationCode).subscribe()

  }

  resendActivationCode(): void {

    this.wait.set(true)

    setTimeout(() => {

      this.wait.set(false)

    }, 5000)

    // Servicio de envío ed email

  }

}
