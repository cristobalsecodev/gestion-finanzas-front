import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { inject } from '@angular/core';
import { resumeRoute } from 'src/app/shared/constants/variables.constants';
import { StorageService } from 'src/app/shared/services/Storage/storage.service';

export const actuallyLoggedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService)

  const storageService = inject(StorageService)

  const router = inject(Router)

  if(authService.isAuthenticated()) {

    router.navigate([resumeRoute])

    return false;

  }

  storageService.removeSession('token')

  return true;

};
