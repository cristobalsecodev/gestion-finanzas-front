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
import { PasswordStrengthService } from 'src/app/shared/services/PasswordStrength/password-strength.service';

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
    private storageervice: StorageService,
    private passwordStrengthService: PasswordStrengthService
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

    this.passwordStrengthService.passwordStrength('passwordStrengthCreateAccount', this.signUpForm.get('password')?.value)

  }
}
