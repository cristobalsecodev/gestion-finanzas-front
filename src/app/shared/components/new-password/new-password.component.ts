import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { passwordMatchValidator } from '../../functions/Validators';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from 'src/app/auth/service/auth.service';
import { StorageService } from '../../services/Storage/storage.service';
import { ResetPassword } from 'src/app/auth/interfaces/ResetPassword.interface';
import { loginRoute } from '../../constants/variables.constants';
import { RouterLink } from '@angular/router';
import { PasswordStrengthService } from '../../services/PasswordStrength/password-strength.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    // Angular core
    ReactiveFormsModule,
    RouterLink,
    // Angular material
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {

  // Loader
  buttonLoader = signal<boolean>(false)

  // Oculta o muestra el tipado de la contraseña
  hidePassword = signal(true)

  // Signal que confirma que el servicio ha ido bien
  serviceCalled = signal(false)

  // Rutas
  loginRoute = loginRoute

  form!: FormGroup

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private passwordStrengthService: PasswordStrengthService
  ) {

    this.form = new FormGroup({

      password: new FormControl('', [Validators.required]),
      passwordConfirm: new FormControl('', [Validators.required])

    }, passwordMatchValidator)

  }

  onSubmit() {

    if(this.form.valid) {

      const resetPassword: ResetPassword = {

        token: this.storageService.getFullUrl().split('/').pop() || '',
        newPassword: this.form.get('password')?.value

      }

      this.buttonLoader.set(true)

      this.authService.resetPassword(resetPassword).subscribe({
        next:() => {

          this.serviceCalled.set(!this.serviceCalled())

          this.buttonLoader.set(false)

        },
        error: () => {
          this.buttonLoader.set(false)
        }
      })

    }

  }

  passwordStrength(): void {

    this.passwordStrengthService.passwordStrength('passwordStrengthNewPassword', this.form.get('password')?.value)

  }
}
