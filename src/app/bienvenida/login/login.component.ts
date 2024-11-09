import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { WantResetPassword } from 'src/app/auth/interfaces/WantResetPassword.interface';
import { AuthService } from 'src/app/auth/service/auth.service';
import { DynamicFlatButtonComponent } from 'src/app/shared/components/dynamic-flat-button/dynamic-flat-button.component';
import { SOCIAL } from 'src/app/shared/constants/svg.constants';
import { newPasswordRoute, signUpRoute } from 'src/app/shared/constants/variables.constants';
import { StorageService } from 'src/app/shared/services/Storage/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    // Components
    DynamicFlatButtonComponent,
    // Angular core
    RouterLink,
    ReactiveFormsModule,
    // Angular material
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatStepperModule,
    MatTooltipModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  // Signal que cambia entre la el formulario de login y el reseteo de contraseña
  changeForm = signal(false)

  // Signal que confirma que el servicio ha ido bien
  serviceCalled = signal(false)

  // Oculta o muestra el tipado de la contraseña
  hidePassword = signal(true)

  // Muestra el texto de pasos a seguir al resetear la contraseña
  resetPasswordSteps = computed( () => this.changeForm() && this.serviceCalled())

  // Confirma que la vida es dura

  // Formulario de login
  form!: FormGroup

  // Formulario de reseteo de contraseña
  resetPaswordForm!: FormGroup

  // Tamaño del texto del botón dinámico
  textSizeRem: number = 1.5

  // Rutas
  signUpRoute = signUpRoute

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
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

    // Añadimos los SVGs
    SOCIAL.forEach(social => {

      this.matIconRegistry.addSvgIconLiteral(
        social.name,
        this.domSanitizer.bypassSecurityTrustHtml(social.svg)
      )
      
    })

  }

  onSubmit(): void {

    if(this.form.valid) {

      this.authService.login(
        this.form.get('email')?.value, 
        this.form.get('password')?.value
      ).subscribe()

    }
  }

  wantResetPassword(): void {

    if(this.resetPaswordForm.valid) {
      
      let wantResetInfo: WantResetPassword = {
  
        email: this.resetPaswordForm.get('email')?.value,
        url: `${this.storageService.getBaseUrl()}/${newPasswordRoute}`
  
      }

      this.authService.wantResetPassword(wantResetInfo).subscribe(() => {

        this.serviceCalled.set(!this.serviceCalled())

      })

    }

  }

}
