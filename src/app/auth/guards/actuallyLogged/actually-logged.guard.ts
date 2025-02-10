import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from 'src/app/shared/services/Storage/storage.service';
import { incomeExpensesRoute } from 'src/app/shared/constants/variables.constants';
import { TokenService } from 'src/app/shared/services/token/token.service';

export const actuallyLoggedGuard: CanActivateFn = (route, state) => {

  const tokenService = inject(TokenService)
  const storageService = inject(StorageService)

  const router = inject(Router)

  if(tokenService.isAuthenticated()) {

    router.navigate([incomeExpensesRoute])

    return false;

  }

  storageService.removeSession('token')

  return true;

};
