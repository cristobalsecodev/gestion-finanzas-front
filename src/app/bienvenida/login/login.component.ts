import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/shared/services/Auth/auth.service';
import { SOCIAL } from 'src/app/shared/constants/svg.constants';
import { createAccountRoute } from 'src/app/shared/constants/variables.constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    // Angular core
    RouterLink,
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
    '[style.--mdc-filled-button-container-height]': '70 + "px"'
  },
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  hidePassword = signal(true);

  form!: FormGroup

  constructor(
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private authService: AuthService
  ) {

    this.form = new FormGroup({

      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),

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
      )

    }
  }

  navigateToCreateAccount(): void {

    this.router.navigate([createAccountRoute])

  }
}
