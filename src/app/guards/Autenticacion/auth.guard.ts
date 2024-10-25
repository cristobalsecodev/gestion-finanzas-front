import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/services/Autenticacion/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot
) => {

  const authService = inject(AuthService)

  if(authService.isAuthenticated()) {

    return true;

  } else {

    inject(Router).navigate(['/login'])

    return false;

  }
};
