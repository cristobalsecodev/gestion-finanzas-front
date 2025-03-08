import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from 'src/app/shared/services/Storage/storage.service';
import { loginRoute, authRoute, currenciesRoute } from 'src/app/shared/constants/variables.constants';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/shared/services/token/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const tokenService = inject(TokenService)

  const storageService = inject(StorageService)

  const router = inject(Router)

  const token = storageService.getSession('token')

  // Verificamos si la URL es una de estas, las cuales hay que excluir
  const excludedRoutes = [authRoute, currenciesRoute]

  if(excludedRoutes.some(route => req.url.includes(route))) {

    return next(req)

  }
  
  // Si no existe el token, redireccionamos al login
  if(!tokenService.isAuthenticated()) {

    router.navigate([loginRoute])
    return next(req)

  }

  // En caso de que exista el token lo añadimos al header
  const clonedReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(clonedReq);

};
