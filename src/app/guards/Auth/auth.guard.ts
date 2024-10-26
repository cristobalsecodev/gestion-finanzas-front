import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/shared/services/Auth/auth.service';
import { loginRoute } from 'src/app/shared/constants/variables.constants';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot
) => {

  const authService = inject(AuthService)

  if(authService.isAuthenticated()) {

    return true;

  } else {

    inject(Router).navigate([loginRoute])

    return false;

  }
};
