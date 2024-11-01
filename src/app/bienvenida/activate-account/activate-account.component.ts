import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InputCodeComponent } from 'src/app/shared/components/input-code/input-code.component';

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

  activateAccount(activationCode: string): void {

    console.log(activationCode)

  }

  resendActivationCode(): void {

    this.wait.set(true)

    setTimeout(() => {

      this.wait.set(false)

    }, 5000)

    // Llamar al servicio de resend

  }

}
