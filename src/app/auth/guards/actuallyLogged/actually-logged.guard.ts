import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { inject } from '@angular/core';
import { resumeRoute } from 'src/app/shared/constants/variables.constants';

export const actuallyLoggedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService)

  const router = inject(Router)

  if(authService.isAuthenticated()) {

    router.navigate([resumeRoute])

    return false;

  }

  return true;

};
