import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import {RouterLink } from '@angular/router';
import { CreateUser } from 'src/app/shared/services/Users/interfaces/CreateUser.interface';
import { AuthService } from 'src/app/auth/service/auth.service';
import { passwordMatchValidator } from 'src/app/shared/functions/Validators';
import { loginRoute } from 'src/app/shared/constants/variables.constants';
import { StorageService } from 'src/app/shared/services/Storage/storage.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    // Angular core
    ReactiveFormsModule,
    RouterLink,
    // Angular material
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {

  hidePassword = signal(true)

  signUpForm!: FormGroup

  // Ruta login
  loginRoute = loginRoute

  // Loader
  buttonLoader = signal<boolean>(false)

  constructor(
    private authService: AuthService,
    private storageervice: StorageService
  ) {

    this.signUpForm = new FormGroup({

      email: new FormControl('', [
        Validators.required, 
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]),

      name: new FormControl('', [Validators.required]),
      surnames: new FormControl(''),

      password: new FormControl('', [Validators.required]),
      passwordConfirm: new FormControl('', [Validators.required])


    }, passwordMatchValidator)

  }

  onSubmit(): void {

    if(this.signUpForm.valid) {

      let user: CreateUser = {
        email: this.signUpForm.get('email')?.value,
        name: this.signUpForm.get('name')?.value,
        surnames: this.signUpForm.get('surnames')?.value,
        password: this.signUpForm.get('password')?.value
      }

      this.buttonLoader.set(true)

      this.authService.signUp(user).subscribe({

        next: () => {

          this.buttonLoader.set(false)

        },
        error: () => {

          this.buttonLoader.set(false)

        }

      })

    }
  }

  formError(type: string): string {
    
    let errorMessage = 'Something failed';

    if (type === 'EMAIL') {

      const emailControl = this.signUpForm.get('email');
      
      if (emailControl?.hasError('required')) {

        errorMessage = 'Email is required.';

      } else if (emailControl?.hasError('pattern')) {

        errorMessage = 'Email is invalid.';

      }

    } else if (type === 'PASSWORD') {

      const passwordControl = this.signUpForm.get('password');
      const passwordConfirmControl = this.signUpForm.get('passwordConfirm');
      
      if (this.signUpForm.hasError('mismatch')) {

        errorMessage = 'Passwords don’t match.';

      } else if (passwordControl?.hasError('required') || passwordConfirmControl?.hasError('required')) {

        errorMessage = 'Password is required.';
      }
    }
  
    return errorMessage;
  }

  passwordStrength(): void {

    const passwordStrengthElement = this.storageervice.documentElementById('passwordStrength')

    if(passwordStrengthElement) {

      const password: string = this.signUpForm.get('password')?.value
      let strength: number = 0
  
      // Más de 8 caracteres
      if (password.length >= 8) strength += 20
      // Al menos una minúscula
      if (password.match(/[a-z]+/)) strength += 20
      // Al menos una mayúscula
      if (password.match(/[A-Z]+/)) strength += 20
      // Al menos un número
      if (password.match(/[0-9]+/)) strength += 20
      // Al menos un caracter raro
      if (password.match(/[^a-zA-Z0-9]/)) strength += 20
  
      passwordStrengthElement.style.width = strength + '%'

      if (strength < 40) {
        passwordStrengthElement.style.backgroundColor = '#ef4444';
      } else if (strength < 60) {
        passwordStrengthElement.style.backgroundColor = '#f59e0b';
      } else if(strength < 80) {
        passwordStrengthElement.style.backgroundColor = '#10b981';
      } else {
        passwordStrengthElement.style.backgroundColor = '#00a550';
      }

    }
  }
}
