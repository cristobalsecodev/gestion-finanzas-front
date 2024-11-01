import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { StorageService } from 'src/app/shared/services/Storage/storage.service';
import { signUpRoute, loginRoute } from 'src/app/shared/constants/variables.constants';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authService = inject(AuthService)

  const storageService = inject(StorageService)

  const router = inject(Router)

  const token = storageService.getSession('token')

  // Verificamos si la URL es una de estas, las cuales hay que excluir
  const excludedRoutes = [loginRoute, signUpRoute]
  
  if(excludedRoutes.some(route => req.url.includes(route))) {

    return next(req)

  }

  // Si no existe el token, redireccionamos al login
  if(!authService.isAuthenticated()) {

    router.navigate([loginRoute])

    return next(req)

  }

  // En caso de que exista el token lo añadimos al header
  const clonedReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(clonedReq);

};
