import { Component, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { loginRoute } from 'src/app/shared/constants/variables.constants';
import { InfoResponse } from 'src/app/shared/interfaces/InfoResponse.interface';
import { CreateUser } from 'src/app/shared/interfaces/User.interface';
import { AuthService } from 'src/app/shared/services/Auth/auth.service';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    // Angular material
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatStepperModule,
    MatTooltipModule
  ],
  host: { 
    '[style.--mdc-filled-button-label-text-size]': '1.450 + "rem"',
    '[style.--mdc-filled-button-container-shape]': '10 + "px"',
    '[style.--mdc-filled-button-container-height]': '70 + "px"',
    '[style.--mdc-protected-button-label-text-size]': '1.450 + "rem"',
    '[style.--mdc-protected-button-container-shape]': '10 + "px"',
    '[style.--mdc-protected-button-container-height]': '60 + "px"',
  },
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {

  hidePassword = signal(true);

  formEmail!: FormGroup
  formName!: FormGroup
  formPassword!: FormGroup

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationsService: NotificacionesService
  ) {

    this.formEmail = new FormGroup({

      email: new FormControl('', [
        Validators.required, 
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ])

    })

    this.formName = new FormGroup({

      name: new FormControl(''),
      surnames: new FormControl(''),

    })

    this.formPassword = new FormGroup({

      password: new FormControl('', [Validators.required]),
      passwordConfirm: new FormControl('', [Validators.required])

    }, this.passwordMatchValidator)

  }

  passwordMatchValidator(control: AbstractControl) {

    const password = control.get('password')?.value
    const passwordConfirm = control.get('passwordConfirm')?.value

    return password === passwordConfirm ? null : { mismatch: true }

  }

  onSubmit(): void {

    if(this.formEmail.valid && this.formPassword.valid) {

      let user: CreateUser = {
        email: this.formEmail.get('email')?.value,
        name: this.formName.get('name')?.value,
        surnames: this.formName.get('surnames')?.value,
        password: this.formPassword.get('password')?.value
      }

      this.authService.register(user).subscribe({
        next: (response: InfoResponse) => {

          this.notificationsService.addNotification(response.message, 'success')

        },
        error: (error) => {
          const errorInfo: InfoResponse = error.error
          this.notificationsService.addNotification(errorInfo.message, 'error')
        }
      });

    }
  }

  navigateToLoginAccount(): void {

    this.router.navigate([loginRoute])

  }

  formError(type: string): string {
    
    let errorMessage = 'Something failed';

    if (type === 'EMAIL') {

      const emailControl = this.formEmail.get('email');
      
      if (emailControl?.hasError('required')) {

        errorMessage = 'Email is required.';

      } else if (emailControl?.hasError('pattern')) {

        errorMessage = 'Email is invalid.';

      }

    } else if (type === 'PASSWORD') {

      const passwordControl = this.formPassword.get('password');
      const passwordConfirmControl = this.formPassword.get('passwordConfirm');
      
      if (this.formPassword.hasError('mismatch')) {

        errorMessage = 'Passwords don’t match.';

      } else if (passwordControl?.hasError('required') || passwordConfirmControl?.hasError('required')) {

        errorMessage = 'Password is required.';
      }
    }
  
    return errorMessage;
  }
}
