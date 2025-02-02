import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { inject } from '@angular/core';
import { StorageService } from 'src/app/shared/services/Storage/storage.service';
import { incomeExpensesRoute } from 'src/app/shared/constants/variables.constants';

export const actuallyLoggedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService)

  const storageService = inject(StorageService)

  const router = inject(Router)

  if(authService.isAuthenticated()) {

    router.navigate([incomeExpensesRoute])

    return false;

  }

  storageService.removeSession('token')

  return true;

};
