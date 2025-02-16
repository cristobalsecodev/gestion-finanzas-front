import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { passwordMatchValidator } from '../../functions/Validators';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from 'src/app/auth/service/auth.service';
import { StorageService } from '../../services/Storage/storage.service';
import { ResetPassword } from 'src/app/auth/interfaces/ResetPassword.interface';
import { loginRoute } from '../../constants/variables.constants';
import { Router, RouterLink } from '@angular/router';
import { NotificacionesService } from '../../services/Notifications/notificaciones.service';
import { DetailError } from '../../interfaces/DetailError.interface';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    // Angular core
    ReactiveFormsModule,
    RouterLink,
    // Angular material
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent implements OnInit {

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
    private notificationService: NotificacionesService,
    private router: Router
  ) {

    this.form = new FormGroup({

      password: new FormControl('', [Validators.required]),
      passwordConfirm: new FormControl('', [Validators.required])

    }, passwordMatchValidator)

  }
  
  ngOnInit(): void {

    // Recuperamos la url completa con el token de url
    // const urlParts: string[] = this.storageService.getFullUrl().split('/')

    // const urlToken = urlParts.pop() || ''

    // this.authService.checkOneTimeUrl(urlToken).subscribe({
    //   next: (response) => {

    //     this.notificationService.addNotification(response.message, 'success')

    //   },
    //   error: () => {

    //     this.router.navigate([loginRoute])

    //   }
    // }) 

  }

  onSubmit() {

    if(this.form.valid) {

      const resetPassword: ResetPassword = {

        token: this.storageService.getFullUrl().split('/').pop() || '',
        newPassword: this.form.get('password')?.value

      }

      this.authService.resetPassword(resetPassword).subscribe({
        next:() => {

          this.serviceCalled.set(!this.serviceCalled())

        }
      })

    }

    

  }
}
