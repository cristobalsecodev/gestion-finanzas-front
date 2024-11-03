import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { passwordMatchValidator } from '../../functions/validators/Validators';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    // Angular core
    ReactiveFormsModule,
    // Angular material
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {

  hidePassword = signal(true);

  form!: FormGroup

  constructor() {

    this.form = new FormGroup({

      password: new FormControl('', [Validators.required]),
      passwordConfirm: new FormControl('', [Validators.required])

    }, passwordMatchValidator)


  }

  onSubmit() {

    

  }
}
