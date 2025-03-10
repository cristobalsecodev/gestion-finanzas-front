import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { WantResetPassword } from 'src/app/auth/interfaces/WantResetPassword.interface';
import { AuthService } from 'src/app/auth/service/auth.service';
import { newPasswordRoute, signUpRoute } from 'src/app/shared/constants/variables.constants';
import { StorageService } from 'src/app/shared/services/Storage/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    // Angular core
    RouterLink,
    ReactiveFormsModule,
    // Angular material
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinner
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  // Signal que cambia entre la el formulario de login y el reseteo de contraseña
  isResetPassword = signal(false)

  // Signal que confirma que el servicio ha ido bien
  serviceCalled = signal(false)

  // Oculta o muestra el tipado de la contraseña
  hidePassword = signal(true)

  // Muestra el texto de pasos a seguir al resetear la contraseña
  resetPasswordSteps = computed( () => this.isResetPassword() && this.serviceCalled())

  // Confirma que la vida es dura

  // Formulario de login
  form!: FormGroup

  // Formulario de reseteo de contraseña
  resetPaswordForm!: FormGroup

  // Tamaño del texto del botón dinámico
  textSizeRem: number = 1.5

  // Rutas
  signUpRoute = signUpRoute

  // Loaders
  buttonLoader = signal<boolean>(false)
  testButtonLoader = signal<boolean>(false)

  constructor(
    private authService: AuthService,
    private storageService: StorageService
  ) {

    this.form = new FormGroup({

      email: new FormControl('', [
        Validators.required, 
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]),
      
      password: new FormControl('', [Validators.required]),

    })

    this.resetPaswordForm = new FormGroup({

      email: new FormControl('', [
        Validators.required, 
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]),

    })

  }

  onSubmit(): void {

    if(this.form.valid) {

      this.buttonLoader.set(true)

      this.authService.login(
        this.form.get('email')?.value, 
        this.form.get('password')?.value
      ).subscribe({

        next: () => {

          this.buttonLoader.set(false)

        },
        error: () => {

          this.buttonLoader.set(false)

        }

      })

    }
  }

  testLogin(): void {

    this.testButtonLoader.set(true)

    this.authService.testLogin().subscribe({

      next: () => {

        this.testButtonLoader.set(false)
        
      },
      error: () => {

        this.testButtonLoader.set(false)

      }

    })

  }

  wantResetPassword(): void {

    if(this.resetPaswordForm.valid) {
      
      let wantResetInfo: WantResetPassword = {
  
        email: this.resetPaswordForm.get('email')?.value,
        url: `${this.storageService.getBaseUrl()}/${newPasswordRoute}`
  
      }

      this.buttonLoader.set(true)

      this.authService.wantResetPassword(wantResetInfo).subscribe({
        
        next: () => {

          this.serviceCalled.set(!this.serviceCalled())

          this.buttonLoader.set(false)

        },
        error: () => {

          this.buttonLoader.set(false)
          
        }

      })

    }

  }

}
