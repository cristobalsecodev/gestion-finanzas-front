import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { switchMap } from 'rxjs';
import { StorageService } from 'src/app/shared/services/Storage/storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authService = inject(AuthService)
  const storageService = inject(StorageService)

  const token = authService.decodeToken()

  if(token && authService.isTokenExpiringSoon()) {

    return authService.refreshToken().pipe(
      switchMap((newToken) => {

          // Guardamos el nuevo token
          storageService.setSession('token', newToken.token)
      
          // Clonamos la solicitud con el nuevo token
          const clonedReq = req.clone({

            headers: req.headers.set('Authorization', `Bearer ${newToken}`)

          })
      
          return next(clonedReq)

      })

    )

  }

  return next(req)

};
